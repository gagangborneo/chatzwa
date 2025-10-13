import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

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

    const prisma = new PrismaClient()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email sudah terdaftar. Gunakan email lain atau login.'
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name?.trim() || null,
        password: hashedPassword,
        role: 'user', // Default role
        isActive: true
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil! Silakan login untuk melanjutkan.',
      data: {
        user: userWithoutPassword
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({
          success: false,
          error: 'Email sudah terdaftar. Gunakan email lain atau login.'
        }, { status: 409 })
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.'
    }, { status: 500 })
  }
}