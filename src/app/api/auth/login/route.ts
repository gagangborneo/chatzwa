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

    const prisma = new PrismaClient()

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

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

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: 'Email atau password salah'
      }, { status: 401 })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    // Create session
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const token = await createSession(user.id, ipAddress, userAgent)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat login. Silakan coba lagi.'
    }, { status: 500 })
  }
}