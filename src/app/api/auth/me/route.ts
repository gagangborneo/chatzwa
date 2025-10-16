import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, unifiedAuth } from '@/lib/auth'

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

    // Use unified auth to get current user (works with both local and Supabase)
    const user = await unifiedAuth.getCurrentUser(token)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Sesi tidak valid atau telah kadaluarsa',
        authenticated: false
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive
        },
        authProvider: unifiedAuth.getAuthProvider()
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