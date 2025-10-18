import { NextResponse } from 'next/server';
import { appwriteDBOperations, APPWRITE_DATABASE_ID, COLLECTIONS } from '@/lib/auth-appwrite';
import { ID } from 'appwrite';

export async function POST(request: Request) {
  try {
    console.log('🔧 Creating new user record in Appwrite database...');

    const { email, password, name, role = 'user' } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Generate user ID
    const userId = ID.unique();

    // Create user record directly in Appwrite Database
    console.log('💾 Creating user record in database...');
    const userRecord = await appwriteDBOperations.createDocument(
      COLLECTIONS.USERS,
      {
        email: email,
        name: name || 'User',
        role: role,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      userId
    );

    console.log('✅ User record created successfully:', email);

    return NextResponse.json({
      success: true,
      message: 'User berhasil dibuat di database',
      user: {
        id: userId,
        email: email,
        name: name || 'User',
        role: role,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      databaseRecord: userRecord
    });

  } catch (error) {
    console.error('❌ User creation failed:', error);

    // Handle specific Appwrite errors
    if (error.message.includes('already exists') || error.message.includes('unique')) {
      return NextResponse.json(
        { success: false, error: 'User dengan email ini sudah ada' },
        { status: 409 }
      );
    }

    if (error.message.includes('Invalid email')) {
      return NextResponse.json(
        { success: false, error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Gagal membuat user',
        message: 'Terjadi kesalahan saat membuat user baru'
      },
      { status: 500 }
    );
  }
}