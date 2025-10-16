import { NextRequest, NextResponse } from 'next/server'
import { unifiedAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await request.json()

    // Validate input
    if (!email || !password || !confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Semua field harus diisi'
      }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: 'Password dan konfirmasi password tidak cocok'
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'Password minimal 6 karakter'
      }, { status: 400 })
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({
        success: false,
        error: 'Format email tidak valid'
      }, { status: 400 })
    }

    // Use unified auth to create user (works with both local and Supabase)
    const user = await unifiedAuth.createUser(email, password, name, 'user')

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login untuk melanjutkan.',
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
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat registrasi. Silakan coba lagi.'

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}