import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, validateSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Tidak ada sesi yang aktif',
        authenticated: false
      }, { status: 401 })
    }

    const user = await validateSession(token)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Sesi tidak valid atau telah kadaluarsa',
        authenticated: false
      }, { status: 401 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: {
        user: userWithoutPassword
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat mengecek autentikasi',
      authenticated: false
    }, { status: 500 })
  }
}