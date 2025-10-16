import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, unifiedAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Tidak ada sesi yang aktif'
      }, { status: 401 })
    }

    // Get user info before logout for logging
    const user = await unifiedAuth.getCurrentUser(token)

    // Use unified auth logout (works with both local and Supabase)
    const logoutSuccess = await unifiedAuth.signOut(token)

    if (!logoutSuccess) {
      return NextResponse.json({
        success: false,
        error: 'Gagal logout. Silakan coba lagi.'
      }, { status: 500 })
    }

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

    const userEmail = user?.email || 'unknown user'
    const authProvider = unifiedAuth.getAuthProvider()
    console.log(`✅ Logout successful for: ${userEmail} (Provider: ${authProvider})`)

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat logout. Silakan coba lagi.'
    }, { status: 500 })
  }
}