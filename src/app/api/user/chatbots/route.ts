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

export async function GET(request: NextRequest) {
  try {
    // Get user from token
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch personas (chatbots) for the user
    const personas = await prisma.persona.findMany({
      where: {
        userId: user.id
      },
      include: {
        // Count messages for each persona
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
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Transform data for frontend
    const chatbots = personas.map(persona => {
      const totalMessages = persona._count.chatMessages
      const messagesThisMonth = persona.chatMessages.filter(
        msg => msg.timestamp >= new Date(new Date().setDate(1))
      ).length
      const webMessages = persona.chatMessages.filter(msg => msg.source === 'web').length
      const whatsappMessages = persona.chatMessages.filter(msg => msg.source === 'whatsapp').length

      return {
        id: persona.id,
        slug: persona.slug,
        name: persona.name,
        description: persona.welcomeMessage,
        welcomeMessage: persona.welcomeMessage,
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
          askFollowUp: persona.askFollowUp
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        chatbots,
        total: chatbots.length,
        active: chatbots.filter(c => c.isActive).length
      }
    })

  } catch (error) {
    console.error('Error fetching user chatbots:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, profile, settings } = body

    if (!name || !profile) {
      return NextResponse.json(
        { success: false, error: 'Name and profile are required' },
        { status: 400 }
      )
    }

    // Create new persona (chatbot)
    const persona = await prisma.persona.create({
      data: {
        name,
        welcomeMessage: description || `Hello! I'm ${name}, your AI assistant. How can I help you today?`,
        selectedProfile: profile,
        createdBy: user.id,
        userId: user.id,
        // Apply default settings based on profile
        ...(settings && {
          formality: settings.formality || 'professional',
          empathy: settings.empathy || 'high',
          enthusiasm: settings.enthusiasm || 'medium',
          humor: settings.humor || 'low',
          verbosity: settings.verbosity || 'medium',
          knowledgeDomain: settings.knowledgeDomain || 'islamic_education',
          languageStyle: settings.languageStyle || 'friendly',
          culturalContext: settings.culturalContext || 'indonesian',
          expertise: settings.expertise || 'general',
          personality: settings.personality || 'helpful',
          maxLength: settings.maxLength || 500,
          useEmojis: settings.useEmojis !== false,
          includeGreeting: settings.includeGreeting !== false,
          askFollowUp: settings.askFollowUp !== false,
          systemPrompt: settings.systemPrompt || '',
          customInstructions: settings.customInstructions || ''
        })
      }
    })

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
        updatedAt: persona.updatedAt
      }
    })

  } catch (error) {
    console.error('Error creating chatbot:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}