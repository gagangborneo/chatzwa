import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unifiedAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to view WordPress integrations',
        },
        { status: 401 }
      )
    }

    const user = await unifiedAuth.getCurrentUser(token)
    if (!user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid authentication token',
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: user.id,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { url: { contains: search, mode: 'insensitive' } },
        { chatbot: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    // Get integrations with related data
    const [integrations, total] = await Promise.all([
      prisma.wordpressIntegration.findMany({
        where,
        include: {
          chatbot: {
            select: {
              id: true,
              name: true,
              apiKey: true,
            },
          },
          _count: {
            select: {
              sessions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.wordpressIntegration.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        integrations,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      message: 'WordPress integrations retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching WordPress integrations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch WordPress integrations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to create WordPress integration',
        },
        { status: 401 }
      )
    }

    const user = await unifiedAuth.getCurrentUser(token)
    if (!user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Invalid authentication token',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      name,
      chatbotId,
      url,
      settings,
    } = body

    // Validate required fields
    if (!name || !chatbotId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Integration name and chatbot ID are required',
        },
        { status: 400 }
      )
    }

    // Check if user owns the chatbot
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: chatbotId,
        userId: user.id,
      },
    })

    if (!chatbot) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chatbot not found',
          message: 'The specified chatbot does not exist or you do not have permission to access it',
        },
        { status: 404 }
      )
    }

    // Check if integration name already exists for this user
    const existingIntegration = await prisma.wordpressIntegration.findFirst({
      where: {
        userId: user.id,
        name,
      },
    })

    if (existingIntegration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Integration already exists',
          message: 'An integration with this name already exists',
        },
        { status: 409 }
      )
    }

    // Create WordPress integration
    const wordpressIntegration = await prisma.wordpressIntegration.create({
      data: {
        userId: user.id,
        chatbotId,
        name,
        url,
        status: 'active',
        settings: settings || {},
        lastSyncAt: new Date(),
      },
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
            apiKey: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: wordpressIntegration,
      message: 'WordPress integration created successfully',
    })
  } catch (error) {
    console.error('Error creating WordPress integration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create WordPress integration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}