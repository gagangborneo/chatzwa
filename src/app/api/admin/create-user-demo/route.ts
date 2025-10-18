import { NextResponse } from 'next/server';
import { appwriteDBOperations, APPWRITE_DATABASE_ID, COLLECTIONS } from '@/lib/auth-appwrite';
import { ID } from 'appwrite';

export async function POST(request: Request) {
  try {
    console.log('🔧 Creating demo user record in Appwrite database...');

    const { email, password, name, role = 'user' } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Generate user ID
    const userId = ID.unique();

    // Create demo user data
    const userData = {
      email: email,
      name: name || 'Demo User',
      role: role,
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      passwordHash: `hashed_${password}`, // Simulasi hash password
      source: 'demo_creation'
    };

    console.log('💾 Creating user record in database...');

    // Try to create user record in Appwrite Database
    let userRecord = null;
    let dbError = null;

    try {
      userRecord = await appwriteDBOperations.createDocument(
        COLLECTIONS.USERS,
        userData,
        userId
      );
      console.log('✅ User record created successfully in Appwrite DB');
    } catch (error) {
      console.log('⚠️  Appwrite DB creation failed:', error.message);
      dbError = error.message;
      // Simulasi sukses dengan data dummy
      userRecord = {
        $id: userId,
        ...userData
      };
    }

    // Return response
    const response = {
      success: true,
      message: dbError ? 'User berhasil dibuat (simulasi - Appwrite DB tidak tersedia)' : 'User berhasil dibuat di Appwrite database',
      user: {
        id: userId,
        email: email,
        name: name || 'Demo User',
        role: role,
        isActive: true,
        createdAt: new Date().toISOString()
      },
      databaseRecord: userRecord,
      appwriteStatus: dbError ? 'simulation' : 'success'
    };

    if (dbError) {
      response.warning = 'Appwrite database tidak tersedia, menggunakan data simulasi';
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ User creation failed:', error);

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