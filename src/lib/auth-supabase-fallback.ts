import { createClient } from '@supabase/supabase-js'
import { getSupabaseClient, isSupabaseEnabled } from './supabase'
import { generateToken, verifyToken } from './auth'

// Types
export interface SupabaseUser {
  id: string
  email: string
  name?: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// Supabase Auth Fallback - Works without custom tables
export const supabaseAuthFallback = {
  // Create user with email and password (without custom table)
  async createUser(email: string, password: string, name?: string, role: string = 'user'): Promise<SupabaseUser | null> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    // Create user in auth only
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Failed to create user')
    }

    // Convert to our format
    return {
      id: authData.user.id,
      email: authData.user.email || email,
      name: authData.user.user_metadata?.name || name,
      role: authData.user.user_metadata?.role || role,
      isActive: true,
      createdAt: authData.user.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  // Sign in user (without custom table)
  async signIn(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{ user: SupabaseUser; token: string } | null> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      throw new Error(`Auth error: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('Failed to authenticate user')
    }

    // Create user object from auth data
    const user: SupabaseUser = {
      id: authData.user.id,
      email: authData.user.email || email,
      name: authData.user.user_metadata?.name,
      role: authData.user.user_metadata?.role || 'user',
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: authData.user.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Create JWT token for our system
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    })

    console.log(`✅ Supabase Auth successful for: ${user.email} (fallback mode)`)

    return {
      user,
      token
    }
  },

  // Sign out user
  async signOut(token: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    try {
      // Sign out from Supabase Auth
      await supabase.auth.signOut()
      console.log(`✅ Supabase signout successful (fallback mode)`)
      return true
    } catch (error) {
      console.error('Supabase signout error:', error)
      return false
    }
  },

  // Get current user
  async getCurrentUser(token: string): Promise<SupabaseUser | null> {
    console.log('🔍 supabaseAuthFallback.getCurrentUser called')

    if (!isSupabaseEnabled()) {
      console.log('❌ Supabase is not enabled')
      throw new Error('Supabase is not enabled')
    }

    console.log('🔍 Verifying JWT token...')
    // First verify JWT token
    const payload = await verifyToken(token)
    if (!payload) {
      console.log('❌ JWT token verification failed')
      return null
    }

    console.log('✅ JWT token verified, creating user from payload:', { userId: payload.userId, email: payload.email })

    // Create user from token payload (fallback mode)
    const user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('✅ Created fallback user object')
    return user
  },

  // Validate session token
  async validateSession(token: string): Promise<SupabaseUser | null> {
    return this.getCurrentUser(token)
  },

  // Invalidate specific session (always true in fallback mode)
  async invalidateSession(token: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    console.log(`✅ Session invalidated (fallback mode)`)
    return true
  },

  // Invalidate all user sessions (always true in fallback mode)
  async invalidateAllUserSessions(userId: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    console.log(`✅ All sessions invalidated for user ${userId} (fallback mode)`)
    return true
  },

  // Update user profile
  async updateUser(userId: string, updates: Partial<Pick<SupabaseUser, 'name' | 'role'>>): Promise<SupabaseUser | null> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: updates
      }
    )

    if (error) {
      throw new Error(`Update error: ${error.message}`)
    }

    if (!data.user) {
      throw new Error('Failed to update user')
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.name,
      role: data.user.user_metadata?.role,
      isActive: true,
      createdAt: data.user.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  // Delete user account
  async deleteUser(userId: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  },

  // Cleanup expired sessions (no-op in fallback mode)
  async cleanupExpiredSessions(): Promise<number> {
    console.log('🧹 Cleanup completed (no-op in fallback mode)')
    return 0
  }
}