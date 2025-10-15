import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('Testing Ollama API directly...')

    const testText = 'Hello world test'
    const response = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: testText,
      }),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log('Error response:', errorText)
      return NextResponse.json({
        error: `Ollama API error: ${response.statusText}`,
        status: response.status,
        details: errorText
      }, { status: 500 })
    }

    const result = await response.json()
    console.log('Success - embedding dimensions:', result.embedding?.length)

    return NextResponse.json({
      success: true,
      dimensions: result.embedding?.length,
      first5: result.embedding?.slice(0, 5)
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}