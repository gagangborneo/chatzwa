import { NextRequest, NextResponse } from 'next/server'
import { unifiedAuth } from '@/lib/auth'

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

    // Get user agent and IP address for session tracking
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || undefined

    // Use unified auth (works with both local and Supabase)
    const authResult = await unifiedAuth.signIn(email, password, ipAddress, userAgent)

    // Return success with user data and session token
    const response = {
      success: true,
      data: {
        user: {
          id: authResult.user.id,
          email: authResult.user.email,
          name: authResult.user.name,
          role: authResult.user.role,
          isActive: authResult.user.isActive
        },
        token: authResult.token,
        authProvider: unifiedAuth.getAuthProvider()
      }
    }

    // Set HTTP-only cookie for session
    const responseObj = NextResponse.json(response)
    responseObj.cookies.set('auth-token', authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log(`✅ Login successful for: ${authResult.user.email} (Provider: ${unifiedAuth.getAuthProvider()})`)
    return responseObj

  } catch (error) {
    console.error('Login error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan server. Silakan coba lagi.'

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 401 })
  }
}