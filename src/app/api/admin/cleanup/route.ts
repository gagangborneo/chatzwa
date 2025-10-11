import { NextRequest, NextResponse } from 'next/server'
import { chatStorage } from '@/lib/chat-storage'
import { db } from '@/lib/db'

// Admin cleanup API - requires admin key for security
const ADMIN_CLEANUP_KEY = process.env.ADMIN_CLEANUP_KEY || 'cleanup-secret-key'

export async function POST(request: NextRequest) {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization')
    const providedKey = authHeader?.replace('Bearer ', '')

    if (providedKey !== ADMIN_CLEANUP_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'local'
    const maxDays = parseInt(searchParams.get('maxDays') || '3')

    let result = {}

    if (type === 'local' || type === 'all') {
      // Clean up local files
      const oldStorage = new (chatStorage.constructor as any)({
        maxLocalDays: maxDays,
        localStoragePath: chatStorage['options'].localStoragePath
      })

      await oldStorage.cleanupOldLocalFiles()
      result.localCleanup = 'Completed'
    }

    if (type === 'database' || type === 'all') {
      // Clean up old database records (older than specified days)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - maxDays)

      const deletedCount = await db.chatMessage.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      })

      result.databaseCleanup = {
        deletedRecords: deletedCount,
        cutoffDate: cutoffDate.toISOString()
      }
    }

    // Get storage statistics after cleanup
    const totalLocalFiles = await chatStorage['getLocalSessionsCount']?.() || 0
    const totalDbRecords = await db.chatMessage.count()

    result.stats = {
      localFiles: totalLocalFiles,
      databaseRecords: totalDbRecords,
      maxRetentionDays: maxDays
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed for ${type} storage`,
      result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cleanup API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization')
    const providedKey = authHeader?.replace('Bearer ', '')

    if (providedKey !== ADMIN_CLEANUP_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get current storage statistics
    const totalDbRecords = await db.chatMessage.count()
    const oldestRecord = await db.chatMessage.findFirst({
      orderBy: { timestamp: 'asc' },
      select: { timestamp: true }
    })

    const newestRecord = await db.chatMessage.findFirst({
      orderBy: { timestamp: 'desc' },
      select: { timestamp: true }
    })

    // Get local file count
    let localFileCount = 0
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      const storagePath = chatStorage['options']?.localStoragePath ||
                        path.join(process.cwd(), 'data', 'chat-sessions')
      const files = await fs.readdir(storagePath)
      localFileCount = files.filter(f => f.endsWith('.json')).length
    } catch {
      localFileCount = 0
    }

    const stats = {
      database: {
        totalRecords,
        oldestRecord: oldestRecord?.timestamp?.toISOString() || null,
        newestRecord: newestRecord?.timestamp?.toISOString() || null
      },
      local: {
        fileCount: localFileCount,
        retentionDays: 3, // Default retention
        storagePath: chatStorage['options']?.localStoragePath || 'data/chat-sessions'
      },
      config: {
        cleanupSchedule: 'Every hour',
        adminCleanupKey: ADMIN_CLEANUP_KEY ? 'Configured' : 'Not set'
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cleanup Stats API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get cleanup statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}