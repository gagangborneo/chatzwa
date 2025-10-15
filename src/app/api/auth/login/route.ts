import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { comparePassword, createSession, AuthUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email dan password harus diisi'
      }, { status: 400 })
    }

    // Mock user database for demo (in production, use your actual database)
    const users = [
      {
        id: 1,
        email: 'admin@admin.com',
        password: 'admin', // In production, this would be hashed
        name: 'Admin User',
        role: 'admin',
        isActive: true
      },
      {
        id: 2,
        email: 'user@7connect.id',
        password: 'user123',
        name: 'Regular User',
        role: 'user',
        isActive: true
      }
    ]

    // Find user by email
    const user = users.find(u => u.email === email.toLowerCase())

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Email atau password salah'
      }, { status: 401 })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Akun Anda tidak aktif. Silakan hubungi administrator.'
      }, { status: 403 })
    }

    // Check password (in production, use proper password hashing)
    if (user.password !== password) {
      return NextResponse.json({
        success: false,
        error: 'Email atau password salah'
      }, { status: 401 })
    }

    // Create session token (in production, use JWT or secure session management)
    const sessionToken = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Return success with user data and session token
    const response = {
      success: true,
      user: userWithoutPassword,
      token: sessionToken
    }

    // Set HTTP-only cookie for session
    const responseObj = NextResponse.json(response)
    responseObj.cookies.set('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return responseObj

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan server'
    }, { status: 500 })
  }
}