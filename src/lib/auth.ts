import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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