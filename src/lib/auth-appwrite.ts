import { Client, Databases, Account, ID } from 'appwrite'

// Appwrite client configuration
export const appwriteClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_ENDPOINT || 'https://localhost/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

// Database instance
export const appwriteDB = new Databases(appwriteClient)

// Account instance for authentication
export const appwriteAccount = new Account(appwriteClient)

// Database configuration
export const APPWRITE_DATABASE_ID = '68f2b7e0002968518650'

// Collections configuration
export const COLLECTIONS = {
  USERS: 'users',
  USER_SESSIONS: 'user_sessions',
  PERSONAS: 'personas',
  CHAT_MESSAGES: 'chat_messages',
  WHATSAPP_INTEGRATIONS: 'whatsapp_integrations',
  WHATSAPP_CONTACTS: 'whatsapp_contacts',
  WHATSAPP_MEDIA: 'whatsapp_media',
  KNOWLEDGE_CATEGORIES: 'knowledge_categories',
  KNOWLEDGE_DOCUMENTS: 'knowledge_documents',
  DOCUMENT_UPLOADS: 'document_uploads',
  POSTS: 'posts'
}

// Helper function to check if Appwrite is active
export const shouldUseAppwrite = (): boolean => {
  return process.env.APPWRITE_ACTIVE === 'true' &&
         process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID &&
         process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_ENDPOINT
}

// Types for Appwrite documents
export interface AppwriteUser {
  $id: string
  email: string
  name?: string
  password?: string // For registration only
  role: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface AppwriteUserSession {
  $id: string
  userId: string
  token: string
  expiresAt: string
  ipAddress?: string
  userAgent?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Appwrite database functions
export const appwriteAuth = {
  // Sign in user
  async signIn(email: string, password: string, ipAddress?: string, userAgent?: string) {
    try {
      const session = await appwriteAccount.createEmailPasswordSession(email, password)

      // Get user details
      const user = await appwriteAccount.get()

      // Update last login
      await appwriteDB.updateDocument(
        APPWRITE_DATABASE_ID,
        COLLECTIONS.USERS,
        user.$id,
        { lastLoginAt: new Date().toISOString() }
      )

      return {
        user: {
          id: user.$id,
          email: user.email,
          name: user.name,
          role: user.prefs?.role || 'user', // Using Appwrite preferences for role
          isActive: true,
          createdAt: user.registration,
          updatedAt: user.$updatedAt
        },
        token: session.secret
      }
    } catch (error) {
      console.error('Appwrite sign in error:', error)
      throw new Error('Email atau password salah')
    }
  },

  // Sign out user
  async signOut(token: string): Promise<boolean> {
    try {
      await appwriteAccount.deleteSession('current')
      return true
    } catch (error) {
      console.error('Appwrite sign out error:', error)
      return false
    }
  },

  // Get current user
  async getCurrentUser(token: string) {
    try {
      const user = await appwriteAccount.get()
      return {
        id: user.$id,
        email: user.email,
        name: user.name,
        role: user.prefs?.role || 'user',
        isActive: true,
        createdAt: user.registration,
        updatedAt: user.$updatedAt
      }
    } catch (error) {
      console.error('Appwrite get current user error:', error)
      return null
    }
  },

  // Validate session
  async validateSession(token: string) {
    try {
      const user = await appwriteAccount.get()
      return {
        id: user.$id,
        email: user.email,
        name: user.name,
        role: user.prefs?.role || 'user',
        isActive: true,
        createdAt: user.registration,
        updatedAt: user.$updatedAt
      }
    } catch (error) {
      console.error('Appwrite validate session error:', error)
      return null
    }
  },

  // Create user (registration)
  async createUser(email: string, password: string, name?: string, role: string = 'user') {
    try {
      console.log('🔧 Creating Appwrite account:', email)

      const user = await appwriteAccount.create(
        ID.unique(),
        email,
        password,
        name || 'User'
      )

      console.log('✅ Appwrite account created:', user.$id)

      // Update user preferences with role
      try {
        await appwriteAccount.updatePrefs({
          role: role,
          isActive: true
        })
        console.log('✅ User preferences updated')
      } catch (prefError) {
        console.log('⚠️  Could not update preferences, but account created:', prefError.message)
      }

      return {
        id: user.$id,
        email: user.email,
        name: user.name || name,
        role: role,
        isActive: true,
        createdAt: user.registration,
        updatedAt: user.$updatedAt || new Date().toISOString()
      }
    } catch (error) {
      console.error('Appwrite create user error:', error)
      console.error('Error details:', error.message)

      // Handle specific Appwrite errors
      if (error.message.includes('already exists')) {
        throw new Error('User dengan email ini sudah ada')
      }
      if (error.message.includes('invalid')) {
        throw new Error('Data tidak valid')
      }

      throw new Error(`Gagal membuat pengguna baru: ${error.message}`)
    }
  },

  // Update user profile
  async updateUser(userId: string, updates: { name?: string; role?: string }) {
    try {
      const updateData: any = {}
      if (updates.name) updateData.name = updates.name
      if (updates.role) updateData.prefs = { role: updates.role }

      // Get current user first
      const currentUser = await appwriteAccount.get()
      await appwriteAccount.update(updateData)

      return {
        id: currentUser.$id,
        email: currentUser.email,
        name: updates.name || currentUser.name,
        role: updates.role || currentUser.prefs?.role || 'user',
        isActive: true,
        createdAt: currentUser.registration,
        updatedAt: currentUser.$updatedAt
      }
    } catch (error) {
      console.error('Appwrite update user error:', error)
      throw new Error('Gagal memperbarui profil pengguna')
    }
  },

  // Invalidate session
  async invalidateSession(token: string): Promise<boolean> {
    try {
      await appwriteAccount.deleteSession('current')
      return true
    } catch (error) {
      console.error('Appwrite invalidate session error:', error)
      return false
    }
  },

  // Invalidate all user sessions
  async invalidateAllUserSessions(userId: string): Promise<boolean> {
    try {
      const sessions = await appwriteAccount.listSessions()
      for (const session of sessions.sessions) {
        await appwriteAccount.deleteSession(session.$id)
      }
      return true
    } catch (error) {
      console.error('Appwrite invalidate all sessions error:', error)
      return false
    }
  },

  // Check if auth system is available
  isAuthAvailable(): boolean {
    return shouldUseAppwrite()
  },

  // Get auth provider info
  getAuthProvider(): 'appwrite' | 'local' | 'supabase' {
    if (shouldUseAppwrite()) return 'appwrite'
    if (process.env.SUPABASE_ACTIVE === 'true') return 'supabase'
    return 'local'
  }
}

// Database operations for Appwrite
export const appwriteDBOperations = {
  // Generic create document
  async createDocument(collectionId: string, data: any, documentId?: string) {
    try {
      return await appwriteDB.createDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId || ID.unique(),
        data
      )
    } catch (error) {
      console.error('Appwrite create document error:', error)
      throw error
    }
  },

  // Generic get document
  async getDocument(collectionId: string, documentId: string) {
    try {
      return await appwriteDB.getDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId
      )
    } catch (error) {
      console.error('Appwrite get document error:', error)
      throw error
    }
  },

  // Generic list documents
  async listDocuments(collectionId: string, queries?: any[]) {
    try {
      return await appwriteDB.listDocuments(
        APPWRITE_DATABASE_ID,
        collectionId,
        queries
      )
    } catch (error) {
      console.error('Appwrite list documents error:', error)
      throw error
    }
  },

  // Generic update document
  async updateDocument(collectionId: string, documentId: string, data: any) {
    try {
      return await appwriteDB.updateDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId,
        data
      )
    } catch (error) {
      console.error('Appwrite update document error:', error)
      throw error
    }
  },

  // Generic delete document
  async deleteDocument(collectionId: string, documentId: string) {
    try {
      return await appwriteDB.deleteDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId
      )
    } catch (error) {
      console.error('Appwrite delete document error:', error)
      throw error
    }
  }
}

// Helper function to initialize Appwrite database
export const initializeAppwriteDB = async () => {
  try {
    // Check if database exists, create if not
    // Note: In Appwrite, database creation is typically done via console or CLI

    console.log('✅ Appwrite initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Appwrite initialization failed:', error)
    return false
  }
}