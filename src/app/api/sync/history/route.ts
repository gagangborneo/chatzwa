import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (in production, use a database)
let syncHistoryData: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 50
    const offset = Number(searchParams.get('offset')) || 0

    // Return sync history with pagination
    const history = syncHistoryData.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        limit,
        offset,
        total: syncHistoryData.length
      }
    })

  } catch (error) {
    console.error('Error fetching sync history:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dataSource, syncType, status, documentsProcessed, embeddingsCreated, errorMessage, duration } = body

    // Create a sync history entry
    const syncEntry = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      data_source: dataSource || 'unknown',
      sync_type: syncType || 'incremental',
      status: status || 'completed',
      documents_processed: documentsProcessed || 0,
      embeddings_created: embeddingsCreated || 0,
      error_message: errorMessage || null,
      duration: duration || 0,
      timestamp: new Date().toISOString()
    }

    // Add to in-memory storage
    syncHistoryData.unshift(syncEntry) // Add to beginning

    return NextResponse.json({
      success: true,
      data: syncEntry
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating sync history:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}