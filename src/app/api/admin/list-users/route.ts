import { NextResponse } from 'next/server';
import { appwriteDBOperations, APPWRITE_DATABASE_ID, COLLECTIONS } from '@/lib/auth-appwrite';

export async function GET() {
  try {
    console.log('🔍 Listing users from Appwrite database...');

    // Try to get users from Appwrite Database
    let users = [];
    let dbError = null;

    try {
      const result = await appwriteDBOperations.listDocuments(COLLECTIONS.USERS);
      users = result.documents || [];
      console.log(`✅ Found ${users.length} users in Appwrite DB`);
    } catch (error) {
      console.log('⚠️  Appwrite DB listing failed:', error.message);
      dbError = error.message;

      // Return demo users if Appwrite DB is not available
      users = [
        {
          $id: '68f2be260014fd2a96c4',
          email: 'demo@appwrite.com',
          name: 'Demo User Appwrite',
          role: 'user',
          isActive: true,
          createdAt: '2025-10-17T22:07:34.335Z',
          lastLoginAt: '2025-10-17T22:07:34.335Z',
          source: 'demo_creation'
        },
        {
          $id: '68f2be2e000c13691ec3',
          email: 'admin@appwrite.com',
          name: 'Admin Appwrite',
          role: 'admin',
          isActive: true,
          createdAt: '2025-10-17T22:07:42.194Z',
          lastLoginAt: '2025-10-17T22:07:42.194Z',
          source: 'demo_creation'
        },
        {
          $id: '68f2be34002f7d6d7b34',
          email: 'user2@appwrite.com',
          name: 'User Two',
          role: 'user',
          isActive: true,
          createdAt: '2025-10-17T22:07:48.759Z',
          lastLoginAt: '2025-10-17T22:07:48.759Z',
          source: 'demo_creation'
        }
      ];
    }

    const response = {
      success: true,
      message: dbError ? 'Daftar user (simulasi - Appwrite DB tidak tersedia)' : 'Daftar user dari Appwrite database',
      totalUsers: users.length,
      users: users.map(user => ({
        id: user.$id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        source: user.source || 'database'
      })),
      appwriteStatus: dbError ? 'simulation' : 'success'
    };

    if (dbError) {
      response.warning = 'Appwrite database tidak tersedia, menampilkan data simulasi';
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ List users failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Gagal mengambil daftar user',
        message: 'Terjadi kesalahan saat mengambil daftar user'
      },
      { status: 500 }
    );
  }
}