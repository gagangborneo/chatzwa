import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const fs = require('fs')
    const path = require('path')

    const filePath = path.join(process.cwd(), 'public', 'embed-chat-react.jsx')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'React component file not found' },
        { status: 404 }
      )
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="embed-chat-react.jsx"'
      }
    })
  } catch (error) {
    console.error('Error serving React component:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}