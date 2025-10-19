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
          message: 'Please login to view users',
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

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Only administrators can view users',
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''

    const skip = (page - 1) * limit

    // Build where clause
    let whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (role) {
      whereClause.role = role
    }

    if (status === 'active') {
      whereClause.isActive = true
    } else if (status === 'inactive') {
      whereClause.isActive = false
    }

    // Get users with comprehensive data
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              subscriptions: true,
              chatbots: true,
              chatMessages: true,
              knowledgeCategories: true,
              knowledgeDocuments: true,
              documentUploads: true,
              personas: true,
              whatsappIntegrations: true,
              sessions: true,
            },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause }),
    ])

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [activeSubscriptions, totalSpent, recentActivity] = await Promise.all([
          // Active subscriptions
          prisma.subscription.count({
            where: {
              userId: user.id,
              status: 'active',
            },
          }),
          // Total spending
          prisma.transaction.aggregate({
            where: {
              userId: user.id,
              status: 'completed',
            },
            _sum: {
              amount: true,
            },
          }),
          // Recent activity (last 30 days)
          prisma.chatMessage.count({
            where: {
              userId: user.id,
              timestamp: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          }),
        ])

        return {
          ...user,
          activeSubscriptions,
          totalSpent: totalSpent._sum.amount || 0,
          recentActivity,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        users: usersWithStats,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
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
          message: 'Please login to create users',
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

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'Only administrators can create users',
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      email,
      name,
      password,
      role = 'user',
      isActive = true,
    } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Email and password are required',
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
          message: 'A user with this email address already exists',
        },
        { status: 409 }
      )
    }

    // Hash password (you should use a proper hashing library)
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        role,
        isActive,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        user: newUser,
      },
      message: 'User created successfully',
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}