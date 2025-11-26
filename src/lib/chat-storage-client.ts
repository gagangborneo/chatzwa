interface Message {
  id: string
  message: string
  response: string
  timestamp: Date
  isUser: boolean
}

export const localStorageClient = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch {
      // Silent fail for localStorage issues
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // Silent fail for localStorage issues
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.clear()
    } catch {
      // Silent fail for localStorage issues
    }
  },

  loadConversation: (): Message[] => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('chat-conversation')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Convert timestamp strings back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }
    } catch (error) {
      console.warn('Failed to load conversation from localStorage:', error)
    }
    return []
  },

  saveConversation: (messages: Message[]): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('chat-conversation', JSON.stringify(messages))
    } catch (error) {
      console.warn('Failed to save conversation to localStorage:', error)
    }
  },

  clearConversation: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem('chat-conversation')
    } catch (error) {
      console.warn('Failed to clear conversation from localStorage:', error)
    }
  },

  cleanup: (): void => {
    if (typeof window === 'undefined') return
    try {
      // Clean up old or expired localStorage data
      const keys = Object.keys(localStorage)
      const now = Date.now()

      keys.forEach(key => {
        if (key.startsWith('chat-') && key !== 'chat-conversation') {
          const item = localStorage.getItem(key)
          if (item) {
            try {
              const parsed = JSON.parse(item)
              // Remove items older than 24 hours
              if (parsed.timestamp && (now - new Date(parsed.timestamp).getTime()) > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(key)
              }
            } catch {
              // Remove invalid items
              localStorage.removeItem(key)
            }
          }
        }
      })
    } catch (error) {
      console.warn('Failed to cleanup localStorage:', error)
    }
  }
}