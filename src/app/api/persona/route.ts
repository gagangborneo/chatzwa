import { NextRequest, NextResponse } from 'next/server'
import { savePersona, getAllPersonas, getActivePersona, searchPersonas, getPersonaBySlug } from '@/lib/persona-service'

// GET - Fetch personas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const active = searchParams.get('active')
    const search = searchParams.get('search')
    const profile = searchParams.get('profile')
    const slug = searchParams.get('slug')

    let personas

    if (slug) {
      // Get persona by slug
      personas = await getPersonaBySlug(slug)
      return NextResponse.json({ success: true, data: personas })
    } else if (active === 'true') {
      // Get active persona
      personas = await getActivePersona(userId || undefined)
      return NextResponse.json({ success: true, data: personas })
    } else if (search) {
      // Search personas
      personas = await searchPersonas(search, userId || undefined)
    } else if (profile) {
      // Get personas by profile
      const { getPersonasByProfile } = await import('@/lib/persona-service')
      personas = await getPersonasByProfile(profile, userId || undefined)
    } else {
      // Get all personas
      personas = await getAllPersonas(userId || undefined)
    }

    return NextResponse.json({
      success: true,
      data: personas,
      count: Array.isArray(personas) ? personas.length : 1
    })
  } catch (error) {
    console.error('GET /api/persona error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Create new persona
export async function POST(request: NextRequest) {
  try {
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

    const persona = await savePersona(personaData, userId || undefined)

    return NextResponse.json({
      success: true,
      data: persona,
      message: 'Persona created successfully'
    })
  } catch (error) {
    console.error('POST /api/persona error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}