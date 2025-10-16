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

export interface SupabaseSession {
  id: string
  userId: string
  token: string
  expiresAt: string
  isActive: boolean
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

// Supabase Auth Functions
export const supabaseAuth = {
  // Create user with email and password
  async createUser(email: string, password: string, name?: string, role: string = 'user'): Promise<SupabaseUser | null> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    // Create user in auth
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

    // Create user record in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        name,
        role,
        is_active: true
      })
      .select()
      .single()

    if (userError) {
      throw new Error(`Database error: ${userError.message}`)
    }

    return userData
  },

  // Sign in user
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

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError) {
      throw new Error(`Database error: ${userError.message}`)
    }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userData.id)

    // Create JWT token for our system
    const token = await generateToken({
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      name: userData.name
    })

    // Create session record
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await supabase
      .from('user_sessions')
      .insert({
        user_id: userData.id,
        token,
        expires_at: expiresAt.toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })

    return {
      user: userData,
      token
    }
  },

  // Sign out user
  async signOut(token: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    // Sign out from Supabase Auth
    await supabase.auth.signOut()

    // Invalidate session in database
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('token', token)

    return !error
  },

  // Get current user
  async getCurrentUser(token: string): Promise<SupabaseUser | null> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    // First verify JWT token
    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Check if session exists and is valid
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id')
      .eq('token', token)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !sessionData) {
      return null
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.user_id)
      .eq('is_active', true)
      .single()

    if (userError) {
      return null
    }

    return userData
  },

  // Validate session token
  async validateSession(token: string): Promise<SupabaseUser | null> {
    return this.getCurrentUser(token)
  },

  // Invalidate specific session
  async invalidateSession(token: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('token', token)

    return !error
  },

  // Invalidate all user sessions
  async invalidateAllUserSessions(userId: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)

    return !error
  },

  // Update user profile
  async updateUser(userId: string, updates: Partial<Pick<SupabaseUser, 'name' | 'role'>>): Promise<SupabaseUser | null> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Update error: ${error.message}`)
    }

    return data
  },

  // Delete user account
  async deleteUser(userId: string): Promise<boolean> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    // Delete user sessions first
    await supabase
      .from('user_sessions')
      .delete()
      .eq('user_id', userId)

    // Delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    return !error
  },

  // Cleanup expired sessions
  async cleanupExpiredSessions(): Promise<number> {
    if (!isSupabaseEnabled()) {
      throw new Error('Supabase is not enabled')
    }

    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .rpc('cleanup_expired_sessions')

    if (error) {
      console.error('Cleanup error:', error)
      return 0
    }

    return data || 0
  }
}

// Helper functions for authentication check
export const isSupabaseConfigured = (): boolean => {
  return isSupabaseEnabled()
}

// Check if we should use Supabase or local auth
export const shouldUseSupabase = (): boolean => {
  return process.env.SUPABASE_ACTIVE === 'true' && isSupabaseEnabled()
}