import { NextRequest, NextResponse } from 'next/server'
import { getPersonaById, savePersona, deletePersona, setActivePersona, duplicatePersona } from '@/lib/persona-service'

// GET - Get specific persona
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const persona = await getPersonaById(params.id)

    if (!persona) {
      return NextResponse.json(
        {
          success: false,
          error: 'Persona not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: persona
    })
  } catch (error) {
    console.error('GET /api/persona/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Update persona
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId, ...personaData } = body

    // Validate required fields
    if (!personaData.name || !personaData.welcomeMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and welcome message are required'
        },
        { status: 400 }
      )
    }

    const persona = await savePersona(
      { ...personaData, id },
      userId || undefined
    )

    return NextResponse.json({
      success: true,
      data: persona,
      message: 'Persona updated successfully'
    })
  } catch (error) {
    console.error('PUT /api/persona/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete persona
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const persona = await deletePersona(params.id)

    return NextResponse.json({
      success: true,
      data: persona,
      message: 'Persona deleted successfully'
    })
  } catch (error) {
    console.error('DELETE /api/persona/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}