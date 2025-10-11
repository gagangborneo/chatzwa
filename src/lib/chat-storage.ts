import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// Conditional imports for server-side only
let fs: typeof import('fs/promises') | null = null
let path: typeof import('path') | null = null

// Only import fs and path on server side
if (typeof window === 'undefined') {
  fs = await import('fs/promises')
  path = await import('path')
}

// Types
export interface ChatMessage {
  id: string
  sessionId: string
  message: string
  response: string
  personaId?: string
  userId?: string
  ip?: string
  userAgent?: string
  timestamp: Date
}

export interface LocalChatData {
  sessionId: string
  messages: Array<{
    message: string
    response: string
    timestamp: number
  }>
  createdAt: number
  lastAccessed: number
}

export interface ChatStorageOptions {
  maxLocalDays?: number
  localStoragePath?: string
}

class ChatStorage {
  private defaultOptions: Required<ChatStorageOptions> = {
    maxLocalDays: 3,
    localStoragePath: path?.join(process.cwd(), 'data', 'chat-sessions') || 'data/chat-sessions'
  }

  constructor(private options: ChatStorageOptions = {}) {
    this.options = { ...this.defaultOptions, ...options }
    this.ensureStorageDirectory()
  }

  private async ensureStorageDirectory() {
    if (!fs || !path) return // Skip if not server-side

    try {
      await fs.access(this.options.localStoragePath!)
    } catch {
      await fs.mkdir(this.options.localStoragePath!, { recursive: true })
    }
  }

  // Get or create session ID
  getSessionId(request?: Request): string {
    // Try to get session ID from cookies or headers
    if (request) {
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const match = cookieHeader.match(/chat_session=([^;]+)/)
        if (match) return match[1]
      }

      // Try from user agent + IP for anonymous users
      const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'

      // Create consistent session ID from IP + User Agent hash
      const sessionSeed = `${ip}-${userAgent}`
      return Buffer.from(sessionSeed).toString('base64').substring(0, 16)
    }

    // Generate new session ID
    return uuidv4().substring(0, 16)
  }

  // Save to local storage
  async saveToLocal(
    sessionId: string,
    message: string,
    response: string
  ): Promise<void> {
    if (!fs || !path) return // Skip if not server-side

    const filePath = path.join(this.options.localStoragePath!, `${sessionId}.json`)

    try {
      let sessionData: LocalChatData

      // Try to read existing session
      try {
        const content = await fs.readFile(filePath, 'utf-8')
        sessionData = JSON.parse(content)
        sessionData.lastAccessed = Date.now()
      } catch {
        // Create new session
        sessionData = {
          sessionId,
          messages: [],
          createdAt: Date.now(),
          lastAccessed: Date.now()
        }
      }

      // Add new message
      sessionData.messages.push({
        message,
        response,
        timestamp: Date.now()
      })

      // Keep only last 50 messages in local storage
      if (sessionData.messages.length > 50) {
        sessionData.messages = sessionData.messages.slice(-50)
      }

      // Save to file
      await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2))

    } catch (error) {
      console.error('Error saving to local storage:', error)
    }
  }

  // Get from local storage
  async getFromLocal(sessionId: string): Promise<LocalChatData | null> {
    if (!fs || !path) return null // Skip if not server-side

    const filePath = path.join(this.options.localStoragePath!, `${sessionId}.json`)

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const sessionData: LocalChatData = JSON.parse(content)

      // Update last accessed time
      sessionData.lastAccessed = Date.now()
      await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2))

      return sessionData
    } catch {
      return null
    }
  }

  // Save to database
  async saveToDatabase(
    sessionId: string,
    message: string,
    response: string,
    personaId?: string,
    userId?: string,
    request?: Request
  ): Promise<void> {
    try {
      await db.chatMessage.create({
        data: {
          sessionId,
          message,
          response,
          personaId,
          userId,
          ip: request?.headers.get('x-forwarded-for') ||
             request?.headers.get('x-real-ip') || undefined,
          userAgent: request?.headers.get('user-agent') || undefined
        }
      })
    } catch (error) {
      console.error('Error saving to database:', error)
    }
  }

  // Get from database
  async getFromDatabase(
    sessionId: string,
    limit: number = 20
  ): Promise<ChatMessage[]> {
    try {
      const messages = await db.chatMessage.findMany({
        where: { sessionId },
        include: {
          persona: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit
      })

      return messages.reverse() // Return in chronological order
    } catch (error) {
      console.error('Error getting from database:', error)
      return []
    }
  }

  // Get chat history (tries local first, then database)
  async getChatHistory(
    sessionId: string,
    request?: Request
  ): Promise<Array<{
    message: string
    response: string
    timestamp: number
    source: 'local' | 'database'
  }>> {
    const history: Array<{
      message: string
      response: string
      timestamp: number
      source: 'local' | 'database'
    }> = []

    // Try local storage first
    const localData = await this.getFromLocal(sessionId)
    if (localData) {
      history.push(...localData.messages.map(msg => ({
        ...msg,
        source: 'local' as const
      })))
    }

    // Also get from database (for backup/analysis)
    const dbMessages = await this.getFromDatabase(sessionId)
    const dbHistory = dbMessages.map(msg => ({
      message: msg.message,
      response: msg.response,
      timestamp: msg.timestamp.getTime(),
      source: 'database' as const
    }))

    // Merge and deduplicate (prefer local data)
    const allMessages = new Map()

    // Add database messages first
    dbHistory.forEach(msg => {
      const key = `${msg.message}-${msg.response}`
      allMessages.set(key, { ...msg, source: 'database' })
    })

    // Override with local messages (more recent)
    history.forEach(msg => {
      const key = `${msg.message}-${msg.response}`
      allMessages.set(key, msg)
    })

    return Array.from(allMessages.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-20) // Return last 20 messages
  }

  // Clean up old local files
  async cleanupOldLocalFiles(): Promise<void> {
    if (!fs || !path) return // Skip if not server-side

    try {
      const files = await fs.readdir(this.options.localStoragePath!)
      const cutoffTime = Date.now() - (this.options.maxLocalDays! * 24 * 60 * 60 * 1000)

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.options.localStoragePath!, file)
          const stats = await fs.stat(filePath)

          if (stats.mtime.getTime() < cutoffTime) {
            await fs.unlink(filePath)
            console.log(`Deleted old chat session: ${file}`)
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up old local files:', error)
    }
  }

  // Get session statistics
  async getSessionStats(sessionId: string): Promise<{
    totalMessages: number
    lastActivity: Date | null
    hasLocalData: boolean
    hasDatabaseData: boolean
  }> {
    const localData = await this.getFromLocal(sessionId)
    const dbMessages = await db.chatMessage.count({
      where: { sessionId }
    })

    const lastMessage = await db.chatMessage.findFirst({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true }
    })

    return {
      totalMessages: (localData?.messages.length || 0) + dbMessages,
      lastActivity: lastMessage?.timestamp || null,
      hasLocalData: !!localData,
      hasDatabaseData: dbMessages > 0
    }
  }

  // Delete session data
  async deleteSession(sessionId: string): Promise<void> {
    // Delete from local storage
    if (fs && path) {
      const filePath = path.join(this.options.localStoragePath!, `${sessionId}.json`)
      try {
        await fs.unlink(filePath)
      } catch {
        // File doesn't exist, ignore
      }
    }

    // Delete from database
    try {
      await db.chatMessage.deleteMany({
        where: { sessionId }
      })
    } catch (error) {
      console.error('Error deleting from database:', error)
    }
  }

  // Save message to both local and database
  async saveMessage(
    sessionId: string,
    message: string,
    response: string,
    personaId?: string,
    userId?: string,
    request?: Request
  ): Promise<void> {
    // Save to both local storage and database in parallel
    await Promise.all([
      this.saveToLocal(sessionId, message, response),
      this.saveToDatabase(sessionId, message, response, personaId, userId, request)
    ])
  }

  // Check if storage is available (client-side check)
  static isStorageAvailable(): boolean {
    // Check if we're on client side and localStorage is available
    if (typeof window === 'undefined') return false

    try {
      const testKey = '__chat_storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  // Client-side save conversation to localStorage
  static saveConversation(messages: any[]): void {
    if (typeof window === 'undefined') return

    try {
      const data = {
        messages: messages,
        timestamp: Date.now()
      }
      localStorage.setItem('chat_conversation', JSON.stringify(data))
    } catch (error) {
      console.error('Error saving conversation to localStorage:', error)
    }
  }

  // Client-side load conversation from localStorage
  static loadConversation(): any[] {
    if (typeof window === 'undefined') return []

    try {
      const data = localStorage.getItem('chat_conversation')
      if (data) {
        const parsed = JSON.parse(data)
        // Return messages if they're not too old (7 days)
        if (Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return parsed.messages || []
        } else {
          // Remove old data
          localStorage.removeItem('chat_conversation')
          return []
        }
      }
    } catch (error) {
      console.error('Error loading conversation from localStorage:', error)
    }

    return []
  }

  // Client-side clear user conversation
  static clearUserConversation(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('chat_conversation')
    } catch (error) {
      console.error('Error clearing conversation from localStorage:', error)
    }
  }
}

// Create and export singleton instance only on server side
let chatStorage: ChatStorage | null = null

if (typeof window === 'undefined') {
  chatStorage = new ChatStorage({
    maxLocalDays: 3, // Keep local files for 3 days
    localStoragePath: path?.join(process.cwd(), 'data', 'chat-sessions') || 'data/chat-sessions'
  })

  // Schedule cleanup every hour
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      chatStorage!.cleanupOldLocalFiles().catch(console.error)
    }, 60 * 60 * 1000) // 1 hour
  }
}

export { chatStorage, ChatStorage }

export default chatStorage