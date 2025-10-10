import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await db.$connect()
    console.log('✅ Database connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await db.$disconnect()
  }
}

// Initialize database connection
export async function initializeDatabase() {
  const isConnected = await testDatabaseConnection()
  if (!isConnected) {
    throw new Error('Failed to connect to database')
  }
  return db
}