import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateSession } from '@/lib/auth'

const prisma = new PrismaClient()

// Helper function to extract token and validate user
const getUserFromRequest = async (request: NextRequest) => {
  // Get token from request headers or cookies
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')

  let token = null

  // Try to get token from Authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // Try to get token from cookies
  if (!token && cookieHeader) {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
    const authCookie = cookies.find(cookie => cookie.startsWith('auth-token='))
    if (authCookie) {
      token = authCookie.substring('auth-token='.length)
    }
  }

  if (!token) {
    return null
  }

  // Validate token and get user
  return await validateSession(token)
}

// GET single chatbot
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const persona = await prisma.persona.findFirst({
      where: {
        id: id,
        userId: user.id
      },
      include: {
        chatMessages: {
          select: {
            id: true,
            timestamp: true,
            source: true
          }
        },
        _count: {
          select: {
            chatMessages: true
          }
        }
      }
    })

    if (!persona) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    const totalMessages = persona._count.chatMessages
    const messagesThisMonth = persona.chatMessages.filter(
      msg => msg.timestamp >= new Date(new Date().setDate(1))
    ).length
    const webMessages = persona.chatMessages.filter(msg => msg.source === 'web').length
    const whatsappMessages = persona.chatMessages.filter(msg => msg.source === 'whatsapp').length

    return NextResponse.json({
      success: true,
      data: {
        id: persona.id,
        slug: persona.slug,
        name: persona.name,
        description: persona.welcomeMessage,
        profile: persona.selectedProfile,
        isActive: persona.isActive,
        createdAt: persona.createdAt,
        updatedAt: persona.updatedAt,
        stats: {
          totalMessages,
          messagesThisMonth,
          webMessages,
          whatsappMessages,
          avgResponseTime: ((persona.minResponseTime + persona.maxResponseTime) / 2).toFixed(1)
        },
        settings: {
          formality: persona.formality,
          empathy: persona.empathy,
          enthusiasm: persona.enthusiasm,
          humor: persona.humor,
          verbosity: persona.verbosity,
          knowledgeDomain: persona.knowledgeDomain,
          languageStyle: persona.languageStyle,
          culturalContext: persona.culturalContext,
          expertise: persona.expertise,
          personality: persona.personality,
          maxLength: persona.maxLength,
          useEmojis: persona.useEmojis,
          includeGreeting: persona.includeGreeting,
          askFollowUp: persona.askFollowUp,
          systemPrompt: persona.systemPrompt,
          customInstructions: persona.customInstructions
        }
      }
    })

  } catch (error) {
    console.error('Error fetching chatbot:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update chatbot
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, profile, settings, isActive } = body
    const { id } = await params

    // Check if chatbot exists and belongs to user
    const existingPersona = await prisma.persona.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingPersona) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Update persona
    const updatedPersona = await prisma.persona.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(description && { welcomeMessage: description }),
        ...(profile && { selectedProfile: profile }),
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(settings && {
          formality: settings.formality,
          empathy: settings.empathy,
          enthusiasm: settings.enthusiasm,
          humor: settings.humor,
          verbosity: settings.verbosity,
          knowledgeDomain: settings.knowledgeDomain,
          languageStyle: settings.languageStyle,
          culturalContext: settings.culturalContext,
          expertise: settings.expertise,
          personality: settings.personality,
          maxLength: settings.maxLength,
          useEmojis: settings.useEmojis,
          includeGreeting: settings.includeGreeting,
          askFollowUp: settings.askFollowUp,
          systemPrompt: settings.systemPrompt,
          customInstructions: settings.customInstructions
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPersona.id,
        name: updatedPersona.name,
        description: updatedPersona.welcomeMessage,
        profile: updatedPersona.selectedProfile,
        isActive: updatedPersona.isActive,
        updatedAt: updatedPersona.updatedAt
      }
    })

  } catch (error) {
    console.error('Error updating chatbot:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE chatbot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if chatbot exists and belongs to user
    const existingPersona = await prisma.persona.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!existingPersona) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Delete persona (this will cascade delete related chat messages)
    await prisma.persona.delete({
      where: { id: id }
    })

    return NextResponse.json({
      success: true,
      message: 'Chatbot deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting chatbot:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}