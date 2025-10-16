import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { shouldUseSupabase, supabaseAuth } from './auth-supabase'
import { supabaseAuthFallback } from './auth-supabase-fallback'

// Types
export interface JWTPayload {
  userId: string
  email: string
  role: string
  name?: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: string
  password: string
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)
const JWT_EXPIRES_IN = '7d' // 7 days
const BCRYPT_ROUNDS = 12

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)
}

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    console.log('🔍 verifyToken called with:', token.substring(0, 20) + '...')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log('✅ Token verification successful:', payload.userId)
    return payload as JWTPayload
  } catch (error) {
    console.log('❌ Token verification failed:', error.message)
    return null
  }
}

// Cookie utilities
export const setAuthCookie = (token: string, response: NextResponse) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }

  response.cookies.set('auth-token', token, cookieOptions)
}

export const deleteAuthCookie = (response: NextResponse) => {
  response.cookies.delete('auth-token')
}

export const getAuthToken = (request: NextRequest): string | null => {
  const token = request.cookies.get('auth-token')?.value
  return token || null
}

// Server-side auth utilities
export const getAuthUser = async (request: NextRequest): Promise<AuthUser | null> => {
  const token = getAuthToken(request)
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  // You might want to fetch fresh user data from database here
  // For now, return the payload data
  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    password: '', // Not included in JWT
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Session management
export const createSession = async (userId: string, ipAddress?: string, userAgent?: string): Promise<string> => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  // Get user data first
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    console.error('User not found for session creation:', userId)
    throw new Error('User not found')
  }

  // Generate token with user data
  const token = await generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || undefined
  })

  // Save session to database
  await prisma.userSession.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent
    }
  })

  return token
}

// Middleware-compatible token verification (Edge Runtime compatible)
export const verifyTokenForMiddleware = async (token: string): Promise<JWTPayload | null> => {
  try {
    console.log('🔍 Middleware token verification for:', token.substring(0, 20) + '...')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log('✅ Middleware token verification successful:', payload.userId)
    return payload as JWTPayload
  } catch (error) {
    console.log('❌ Middleware token verification failed:', error.message)
    return null
  }
}

export const validateSession = async (token: string): Promise<AuthUser | null> => {
  console.log('🔍 validateSession called with token:', token.substring(0, 20) + '...')

  const payload = await verifyToken(token)
  if (!payload) {
    console.log('❌ Token verification failed')
    return null
  }

  console.log('✅ Token verified, payload:', { userId: payload.userId, email: payload.email })

  // For local auth mode, check if this is a hardcoded user
  const hardcodedUsers = [
    {
      userId: 'admin_user_id',
      email: 'admin@admin.com',
      name: 'Admin User',
      role: 'admin'
    },
    {
      userId: 'regular_user_id',
      email: 'user@7connect.id',
      name: 'Regular User',
      role: 'user'
    }
  ]

  const hardcodedUser = hardcodedUsers.find(u => u.userId === payload.userId)
  if (hardcodedUser) {
    console.log('✅ Local auth mode - returning hardcoded user:', hardcodedUser.email)
    return {
      id: hardcodedUser.userId,
      email: hardcodedUser.email,
      name: hardcodedUser.name,
      role: hardcodedUser.role,
      password: '', // Not included in JWT
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  // For database users, check session in database
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    // Check if session exists and is valid
    console.log('🔍 Looking for session in database...')
    const session = await prisma.userSession.findFirst({
      where: {
        token,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    })

    console.log('📋 Session found:', !!session)
    if (session) {
      console.log('📋 Session details:', {
        id: session.id,
        isActive: session.isActive,
        expiresAt: session.expiresAt,
        userFound: !!session.user,
        userActive: session.user?.isActive
      })
    }

    if (!session || !session.user.isActive) {
      console.log('❌ Session invalid or user inactive')
      return null
    }

    console.log('✅ Session valid, returning user:', session.user.email)
    return session.user
  } catch (error) {
    console.error('❌ Error in validateSession:', error)
    return null
  }
}

export const invalidateSession = async (token: string): Promise<void> => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  await prisma.userSession.updateMany({
    where: { token },
    data: { isActive: false }
  })
}

export const invalidateAllUserSessions = async (userId: string): Promise<void> => {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  await prisma.userSession.updateMany({
    where: { userId },
    data: { isActive: false }
  })
}

// Clean up expired sessions
export const cleanupExpiredSessions = async (): Promise<void> => {
  if (shouldUseSupabase()) {
    await supabaseAuth.cleanupExpiredSessions()
    return
  }

  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  await prisma.userSession.updateMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    },
    data: { isActive: false }
  })
}

// Unified authentication functions that work with both local and Supabase
export const unifiedAuth = {
  // Sign in user (works with both auth systems)
  async signIn(email: string, password: string, ipAddress?: string, userAgent?: string) {
    if (shouldUseSupabase()) {
      try {
        return await supabaseAuth.signIn(email, password, ipAddress, userAgent)
      } catch (error) {
        // Fallback to Supabase auth without custom tables if schema not set up
        console.log('⚠️  Schema not found, using Supabase auth fallback mode')
        return await supabaseAuthFallback.signIn(email, password, ipAddress, userAgent)
      }
    }

    // Local auth implementation
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Mock user validation (in production, use real database)
    const validCredentials = [
      {
        email: 'admin@admin.com',
        password: 'admin',
        userId: 'admin_user_id',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'user@7connect.id',
        password: 'user123',
        userId: 'regular_user_id',
        name: 'Regular User',
        role: 'user'
      }
    ]

    const credentials = validCredentials.find(cred =>
      cred.email === email.toLowerCase() && cred.password === password
    )

    if (!credentials) {
      throw new Error('Email atau password salah')
    }

    // Create JWT token
    const token = await generateToken({
      userId: credentials.userId,
      email: credentials.email,
      role: credentials.role,
      name: credentials.name
    })

    // Skip database session creation for hardcoded users (local auth mode)
    console.log('🔧 Local auth mode - skipping database session creation for:', credentials.email)

    return {
      user: {
        id: credentials.userId,
        email: credentials.email,
        name: credentials.name,
        role: credentials.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      token
    }
  },

  // Sign out user
  async signOut(token: string): Promise<boolean> {
    if (shouldUseSupabase()) {
      try {
        return await supabaseAuth.signOut(token)
      } catch (error) {
        // Fallback to Supabase auth without custom tables if schema not set up
        console.log('⚠️  Schema not found, using Supabase auth fallback mode for signout')
        return await supabaseAuthFallback.signOut(token)
      }
    }

    return invalidateSession(token)
  },

  // Get current user
  async getCurrentUser(token: string) {
    console.log('🔍 unifiedAuth.getCurrentUser called')
    console.log('📋 shouldUseSupabase():', shouldUseSupabase())

    if (shouldUseSupabase()) {
      try {
        console.log('🔍 Trying supabaseAuth.getCurrentUser...')
        const result = await supabaseAuth.getCurrentUser(token)
        console.log('✅ supabaseAuth.getCurrentUser result:', !!result)
        return result
      } catch (error) {
        // Fallback to Supabase auth without custom tables if schema not set up
        console.log('⚠️  Schema not found, using Supabase auth fallback mode for getCurrentUser')
        console.log('📋 Error:', error.message)
        try {
          const fallbackResult = await supabaseAuthFallback.getCurrentUser(token)
          console.log('✅ supabaseAuthFallback.getCurrentUser result:', !!fallbackResult)
          return fallbackResult
        } catch (fallbackError) {
          console.log('❌ Fallback also failed:', fallbackError.message)
          return null
        }
      }
    }

    console.log('🔍 Using local validateSession...')
    return validateSession(token)
  },

  // Validate session
  async validateSession(token: string) {
    if (shouldUseSupabase()) {
      return supabaseAuth.validateSession(token)
    }

    return validateSession(token)
  },

  // Create user (registration)
  async createUser(email: string, password: string, name?: string, role: string = 'user') {
    if (shouldUseSupabase()) {
      try {
        return await supabaseAuth.createUser(email, password, name, role)
      } catch (error) {
        // Fallback to Supabase auth without custom tables if schema not set up
        console.log('⚠️  Schema not found, using Supabase auth fallback mode for registration')
        return await supabaseAuthFallback.createUser(email, password, name, role)
      }
    }

    throw new Error('User registration is only available when Supabase is enabled')
  },

  // Invalidate session
  async invalidateSession(token: string): Promise<boolean> {
    if (shouldUseSupabase()) {
      return supabaseAuth.invalidateSession(token)
    }

    return invalidateSession(token)
  },

  // Invalidate all user sessions
  async invalidateAllUserSessions(userId: string): Promise<boolean> {
    if (shouldUseSupabase()) {
      return supabaseAuth.invalidateAllUserSessions(userId)
    }

    return invalidateAllUserSessions(userId)
  },

  // Update user profile
  async updateUser(userId: string, updates: { name?: string; role?: string }) {
    if (shouldUseSupabase()) {
      return supabaseAuth.updateUser(userId, updates)
    }

    throw new Error('User profile updates are only available when Supabase is enabled')
  },

  // Check if auth system is available
  isAuthAvailable(): boolean {
    return shouldUseSupabase() || true // Local auth is always available
  },

  // Get auth provider info
  getAuthProvider(): 'supabase' | 'local' {
    return shouldUseSupabase() ? 'supabase' : 'local'
  }
}