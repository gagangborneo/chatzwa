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
          message: 'Please login to view subscriptions',
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
    const status = searchParams.get('status')
    const includePackage = searchParams.get('includePackage') === 'true'

    let whereClause: any = {
      userId: user.id,
    }

    if (status) {
      whereClause.status = status
    }

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
      include: {
        package: includePackage,
        user: false, // Don't include user data
      },
      orderBy: [
        { status: 'desc' }, // Active subscriptions first
        { createdAt: 'desc' },
      ],
    })

    // Get current active subscription with package details
    const activeSubscription = subscriptions.find(sub => sub.status === 'active')

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        activeSubscription,
        count: subscriptions.length,
        hasActiveSubscription: !!activeSubscription,
      },
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch subscriptions',
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
          message: 'Please login to create subscription',
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
      packageId,
      paymentMethod,
      billingCycle,
    } = body

    // Validate required fields
    if (!packageId || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'PackageId and paymentMethod are required',
        },
        { status: 400 }
      )
    }

    // Get package details
    const packageData = await prisma.package.findUnique({
      where: { id: packageId, isActive: true },
    })

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
          message: 'The requested package does not exist or is not active',
        },
        { status: 404 }
      )
    }

    // Check if user already has active subscription
    const existingActiveSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'active',
      },
    })

    if (existingActiveSubscription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Active subscription exists',
          message: 'You already have an active subscription. Please cancel it first or upgrade your plan.',
        },
        { status: 409 }
      )
    }

    // Calculate subscription dates
    const now = new Date()
    let endDate: Date | null = null
    let nextBillingDate: Date | null = null

    if (packageData.billingCycle === 'monthly') {
      endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
      nextBillingDate = endDate
    } else if (packageData.billingCycle === 'yearly') {
      endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // 365 days
      nextBillingDate = endDate
    }
    // lifetime doesn't have endDate or nextBillingDate

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        packageId,
        status: 'pending', // Will be updated to active after payment
        startDate: now,
        endDate,
        nextBillingDate,
        basePrice: packageData.price,
        totalAmount: packageData.price,
        currency: packageData.currency,
        isAutoRenew: packageData.billingCycle !== 'lifetime',
        usageResetAt: packageData.billingCycle === 'monthly' ?
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
        paymentMethod,
        currentUsage: {
          chatbots: 0,
          messages: 0,
          knowledgeDocs: 0,
          apiCalls: 0,
        },
      },
      include: {
        package: true,
      },
    })

    // Create initial transaction for subscription payment
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
        type: 'subscription',
        amount: packageData.price,
        currency: packageData.currency,
        status: 'pending',
        description: `Pembayaran langganan ${packageData.displayName}`,
        paymentMethod,
        baseAmount: packageData.price,
        totalAmount: packageData.price,
        dueDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Due in 24 hours
        nextBillingDate: subscription.nextBillingDate,
      },
    })

    // TODO: Integrate with payment gateway here
    // For now, return mock payment URL
    const paymentUrl = `https://payment-gateway.example.com/pay/${transaction.id}`

    // Update transaction with payment URL
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentUrl,
        expiredAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Expire in 24 hours
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        transaction: {
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          paymentUrl,
          expiredAt: transaction.expiredAt,
        },
      },
      message: 'Subscription created successfully. Please complete payment to activate.',
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subscription',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}