import { NextRequest, NextResponse } from 'next/server'
import { setActivePersona } from '@/lib/persona-service'

// POST - Set persona as active
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { userId } = body

    const persona = await setActivePersona(params.id, userId || undefined)

    return NextResponse.json({
      success: true,
      data: persona,
      message: 'Persona activated successfully'
    })
  } catch (error) {
    console.error('POST /api/persona/[id]/activate error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}