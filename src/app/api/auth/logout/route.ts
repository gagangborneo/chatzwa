import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, unifiedAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    // Always clear the auth cookie, even if token is invalid
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

    if (!token) {
      console.log('📝 Logout called without token - clearing cookie and returning success')
      return response
    }

    try {
      // Get user info before logout for logging
      const user = await unifiedAuth.getCurrentUser(token)

      // Use unified auth logout (works with both local and Supabase)
      const logoutSuccess = await unifiedAuth.signOut(token)

      if (!logoutSuccess) {
        console.log('⚠️ Logout API call failed, but continuing with cookie clearing')
      }

      const userEmail = user?.email || 'unknown user'
      const authProvider = unifiedAuth.getAuthProvider()
      console.log(`✅ Logout successful for: ${userEmail} (Provider: ${authProvider})`)
    } catch (authError) {
      console.log('⚠️ Auth error during logout, but continuing with cookie clearing:', authError.message)
    }

    return response

  } catch (error) {
    console.error('Logout error:', error)

    // Even if there's an error, try to clear the cookie and return success
    const fallbackResponse = NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    })

    fallbackResponse.cookies.delete('auth-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return fallbackResponse
  }
}