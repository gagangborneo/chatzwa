import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unifiedAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to view user details',
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
          message: 'Only administrators can view user details',
        },
        { status: 403 }
      )
    }

    const { id: userId } = await params

    // Get user with detailed information
    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
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
    })

    if (!userDetails) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'The requested user does not exist',
        },
        { status: 404 }
      )
    }

    // Get comprehensive user data
    const [
      activeSubscriptions,
      totalSpent,
      recentChatMessages,
      recentChatbots,
      userSessions,
      subscriptionHistory,
      knowledgeDocuments,
      recentActivity
    ] = await Promise.all([
      // Active subscriptions with package details
      prisma.subscription.findMany({
        where: {
          userId: userId,
          status: 'active',
        },
        include: {
          package: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      // Total spending
      prisma.transaction.aggregate({
        where: {
          userId: userId,
          status: 'completed',
        },
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      // Recent chat messages with persona info
      prisma.chatMessage.findMany({
        where: { userId: userId },
        select: {
          id: true,
          message: true,
          response: true,
          timestamp: true,
          source: true,
          persona: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
      }),
      // User's chatbots with detailed stats
      prisma.chatbot.findMany({
        where: { userId: userId },
        select: {
          id: true,
          name: true,
          status: true,
          totalMessages: true,
          totalTokens: true,
          lastUsedAt: true,
          createdAt: true,
          model: true,
          language: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      // Active sessions
      prisma.userSession.findMany({
        where: {
          userId: userId,
          isActive: true,
        },
        select: {
          id: true,
          ipAddress: true,
          userAgent: true,
          createdAt: true,
          expiresAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      // Complete subscription history
      prisma.subscription.findMany({
        where: { userId: userId },
        include: {
          package: {
            select: {
              name: true,
              displayName: true,
              price: true,
              currency: true,
              billingCycle: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      // Knowledge documents
      prisma.knowledgeDocument.findMany({
        where: { createdBy: userId },
        select: {
          id: true,
          title: true,
          status: true,
          isIndexed: true,
          embeddingCount: true,
          createdAt: true,
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      // Recent activity count (last 30 days)
      prisma.chatMessage.count({
        where: {
          userId: userId,
          timestamp: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ])

    // Calculate comprehensive statistics
    const stats = {
      totalMessages: userDetails._count.chatMessages,
      totalChatbots: userDetails._count.chatbots,
      totalKnowledgeDocs: userDetails._count.knowledgeDocuments,
      totalSubscriptions: userDetails._count.subscriptions,
      activeSessions: userDetails._count.sessions,
      activeSubscriptions: activeSubscriptions.length,
      totalSpent: totalSpent._sum.amount || 0,
      totalTransactions: totalSpent._count,
      recentActivity,
      avgMessagesPerChatbot: userDetails._count.chatbots > 0
        ? Math.round(userDetails._count.chatMessages / userDetails._count.chatbots)
        : 0,
      totalKnowledgeCategories: userDetails._count.knowledgeCategories,
      totalPersonas: userDetails._count.personas,
      whatsappIntegrations: userDetails._count.whatsappIntegrations,
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userDetails,
        activeSubscriptions,
        recentChatMessages,
        recentChatbots,
        userSessions,
        subscriptionHistory,
        knowledgeDocuments,
        stats,
      },
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to update users',
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
          message: 'Only administrators can update users',
        },
        { status: 403 }
      )
    }

    const { id: userId } = await params
    const body = await request.json()
    const {
      name,
      role,
      isActive,
      password,
    } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'The requested user does not exist',
        },
        { status: 404 }
      )
    }

    // Prevent admin from deactivating themselves
    if (userId === user.id && isActive === false) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot deactivate yourself',
          message: 'You cannot deactivate your own account',
        },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    // Handle password update
    if (password) {
      const bcrypt = require('bcryptjs')
      updateData.password = await bcrypt.hash(password, 12)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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
        user: updatedUser,
      },
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to delete users',
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
          message: 'Only administrators can delete users',
        },
        { status: 403 }
      )
    }

    const { id: userId } = await params

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete yourself',
          message: 'You cannot delete your own account',
        },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'The requested user does not exist',
        },
        { status: 404 }
      )
    }

    // Delete user (this will cascade delete related records)
    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete user',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}