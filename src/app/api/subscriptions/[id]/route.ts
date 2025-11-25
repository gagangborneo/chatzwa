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
          message: 'Please login to view subscription details',
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

    const { id: subscriptionId } = await params

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id, // Only allow user to view their own subscriptions
      },
      include: {
        package: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Get last 10 transactions
        },
        invoices: {
          orderBy: { issuedAt: 'desc' },
          take: 5, // Get last 5 invoices
        },
        chatbots: {
          where: { status: 'active' },
          select: {
            id: true,
            name: true,
            status: true,
            totalMessages: true,
            lastUsedAt: true,
            createdAt: true,
          },
        },
      },
    })

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription not found',
          message: 'The requested subscription does not exist or you do not have permission to view it',
        },
        { status: 404 }
      )
    }

    // Calculate usage statistics
    const currentUsage = subscription.currentUsage as any || {}
    const packageLimits = {
      maxChatbots: subscription.package.maxChatbots,
      maxMessages: subscription.package.maxMessages,
      maxKnowledgeDocs: subscription.package.maxKnowledgeDocs,
      maxTeamMembers: subscription.package.maxTeamMembers,
      maxApiCalls: subscription.package.maxApiCalls,
    }

    const usageStats = {
      chatbots: {
        current: currentUsage.chatbots || 0,
        limit: packageLimits.maxChatbots,
        percentage: packageLimits.maxChatbots ?
          Math.round(((currentUsage.chatbots || 0) / packageLimits.maxChatbots) * 100) : 0,
        isUnlimited: !packageLimits.maxChatbots,
      },
      messages: {
        current: currentUsage.messages || 0,
        limit: packageLimits.maxMessages,
        percentage: packageLimits.maxMessages ?
          Math.round(((currentUsage.messages || 0) / packageLimits.maxMessages) * 100) : 0,
        isUnlimited: !packageLimits.maxMessages,
      },
      knowledgeDocs: {
        current: currentUsage.knowledgeDocs || 0,
        limit: packageLimits.maxKnowledgeDocs,
        percentage: packageLimits.maxKnowledgeDocs ?
          Math.round(((currentUsage.knowledgeDocs || 0) / packageLimits.maxKnowledgeDocs) * 100) : 0,
        isUnlimited: !packageLimits.maxKnowledgeDocs,
      },
      apiCalls: {
        current: currentUsage.apiCalls || 0,
        limit: packageLimits.maxApiCalls,
        percentage: packageLimits.maxApiCalls ?
          Math.round(((currentUsage.apiCalls || 0) / packageLimits.maxApiCalls) * 100) : 0,
        isUnlimited: !packageLimits.maxApiCalls,
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        usageStats,
        canCreateChatbot: usageStats.chatbots.isUnlimited || usageStats.chatbots.current < usageStats.chatbots.limit,
        packageFeatures: subscription.package.features,
        isActive: subscription.status === 'active',
        willRenew: subscription.isAutoRenew && subscription.status === 'active',
      },
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subscription',
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
          message: 'Please login to update subscription',
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

    const { id: subscriptionId } = await params
    const body = await request.json()
    const {
      isAutoRenew,
      cancellationReason,
    } = body

    // Verify subscription belongs to user
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id,
      },
    })

    if (!existingSubscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription not found',
          message: 'The requested subscription does not exist or you do not have permission to modify it',
        },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Handle auto-renewal toggle
    if (typeof isAutoRenew === 'boolean') {
      updateData.isAutoRenew = isAutoRenew

      // If disabling auto-renewal and subscription is active, set end date
      if (!isAutoRenew && existingSubscription.status === 'active' && existingSubscription.endDate) {
        updateData.endDate = existingSubscription.endDate
      }
    }

    // Handle cancellation
    if (cancellationReason && existingSubscription.status === 'active') {
      updateData.status = 'cancelled'
      updateData.cancelledAt = new Date()
      updateData.cancellationReason = cancellationReason
      updateData.endDate = new Date() // End subscription immediately
      updateData.nextBillingDate = null
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
      include: {
        package: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        subscription: updatedSubscription,
      },
      message: isAutoRenew !== undefined ?
        `Auto-renewal ${isAutoRenew ? 'enabled' : 'disabled'} successfully` :
        'Subscription updated successfully',
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}