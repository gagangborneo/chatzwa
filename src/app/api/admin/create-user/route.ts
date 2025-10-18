import { NextResponse } from 'next/server';
import { appwriteAuth, appwriteDBOperations, APPWRITE_DATABASE_ID, COLLECTIONS } from '@/lib/auth-appwrite';

export async function POST(request: Request) {
  try {
    console.log('🔧 Creating new user in Appwrite...');

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

    // Create user in Appwrite Auth
    console.log('📝 Creating Appwrite account...');
    const authUser = await appwriteAuth.createUser(email, password, name, role);

    if (!authUser) {
      throw new Error('Gagal membuat user di Appwrite Auth');
    }

    // Create user record in Appwrite Database
    console.log('💾 Creating user record in database...');
    const userRecord = await appwriteDBOperations.createDocument(
      COLLECTIONS.USERS,
      {
        email: authUser.email,
        name: authUser.name || name,
        role: authUser.role,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: authUser.createdAt,
        updatedAt: authUser.updatedAt
      },
      authUser.id
    );

    console.log('✅ User created successfully:', authUser.email);

    return NextResponse.json({
      success: true,
      message: 'User berhasil dibuat',
      user: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
        isActive: true,
        createdAt: authUser.createdAt
      },
      databaseRecord: userRecord
    });

  } catch (error) {
    console.error('❌ User creation failed:', error);

    // Handle specific Appwrite errors
    if (error.message.includes('already exists')) {
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

    if (error.message.includes('Password')) {
      return NextResponse.json(
        { success: false, error: 'Password tidak valid' },
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