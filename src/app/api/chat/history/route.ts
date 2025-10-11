import { NextRequest, NextResponse } from 'next/server'
import { chatStorage } from '@/lib/chat-storage'

export async function GET(request: NextRequest) {
  try {
    const sessionId = chatStorage.getSessionId(request)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get chat history
    const history = await chatStorage.getChatHistory(sessionId, request)
    const stats = await chatStorage.getSessionStats(sessionId)

    return NextResponse.json({
      sessionId,
      history: history.slice(-limit), // Return last N messages
      stats,
      success: true
    })

  } catch (error) {
    console.error('Chat History API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to get chat history',
        success: false
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = chatStorage.getSessionId(request)

    // Delete session data
    await chatStorage.deleteSession(sessionId)

    return NextResponse.json({
      message: 'Chat history deleted successfully',
      sessionId,
      success: true
    })

  } catch (error) {
    console.error('Chat History Delete API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to delete chat history',
        success: false
      },
      { status: 500 }
    )
  }
}