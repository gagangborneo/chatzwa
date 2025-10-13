import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, invalidateSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Tidak ada sesi yang aktif'
      }, { status: 401 })
    }

    // Invalidate session
    await invalidateSession(token)

    // Clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    })

    response.cookies.delete('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat logout. Silakan coba lagi.'
    }, { status: 500 })
  }
}