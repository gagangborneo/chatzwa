import { NextRequest, NextResponse } from 'next/server'
import { testDatabaseConnection, db } from '@/lib/db'

export async function GET() {
  try {
    const isConnected = await testDatabaseConnection()

    if (isConnected) {
      // Test a simple query
      const result = await db.$queryRaw`SELECT version() as version`

      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        details: {
          provider: 'postgresql',
          url: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
          version: result
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        details: {
          provider: 'postgresql',
          url: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'),
        }
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        provider: 'postgresql',
        url: process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'),
      }
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Test database write operation
    const testUser = await db.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Database Connection Test',
      }
    })

    // Clean up test user
    await db.user.delete({
      where: { id: testUser.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Database read/write test successful',
      details: {
        testUserId: testUser.id,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Database write test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Database write test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}