import { NextRequest, NextResponse } from 'next/server'
import { duplicatePersona } from '@/lib/persona-service'

// POST - Duplicate persona
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { newName } = body

    const persona = await duplicatePersona(params.id, newName)

    return NextResponse.json({
      success: true,
      data: persona,
      message: 'Persona duplicated successfully'
    })
  } catch (error) {
    console.error('POST /api/persona/[id]/duplicate error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}