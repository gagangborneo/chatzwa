import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unifiedAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to view transactions',
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
          message: 'Please login to view transactions',
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const includeInvoice = searchParams.get('includeInvoice') === 'true'

    let whereClause: any = {
      userId: user.id,
    }

    if (status) {
      whereClause.status = status
    }

    if (type) {
      whereClause.type = type
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          subscription: {
            include: {
              package: {
                select: {
                  name: true,
                  displayName: true,
                },
              },
            },
          },
          invoice: includeInvoice,
          user: false, // Don't include user data
        },
        orderBy: { createdAt: 'desc' },
        take: Math.min(limit, 100), // Limit to 100 max
        skip: offset,
      }),
      prisma.transaction.count({ where: whereClause }),
    ])

    // Calculate summary statistics
    const summary = {
      totalTransactions: total,
      totalAmount: await prisma.transaction.aggregate({
        where: {
          userId: user.id,
          status: 'completed',
        },
        _sum: {
          amount: true,
        },
      }),
      pendingAmount: await prisma.transaction.aggregate({
        where: {
          userId: user.id,
          status: 'pending',
        },
        _sum: {
          amount: true,
        },
      }),
      completedTransactions: await prisma.transaction.count({
        where: {
          userId: user.id,
          status: 'completed',
        },
      }),
      pendingTransactions: await prisma.transaction.count({
        where: {
          userId: user.id,
          status: 'pending',
        },
      }),
    }

    return NextResponse.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
        summary: {
          totalTransactions: summary.totalTransactions,
          totalSpent: summary.totalAmount._sum.amount || 0,
          pendingAmount: summary.pendingAmount._sum.amount || 0,
          completedTransactions: summary.completedTransactions,
          pendingTransactions: summary.pendingTransactions,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transactions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to create transaction',
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      subscriptionId,
      type,
      amount,
      description,
      paymentMethod,
    } = body

    // Validate required fields
    if (!type || amount === undefined || !description || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Type, amount, description, and paymentMethod are required',
        },
        { status: 400 }
      )
    }

    // Validate transaction type
    const validTypes = ['subscription', 'renewal', 'upgrade', 'downgrade', 'setup_fee', 'overage']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid transaction type',
          message: `Type must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // If subscriptionId is provided, verify it belongs to user
    if (subscriptionId) {
      const subscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
          userId: user.id,
        },
      })

      if (!subscription) {
        return NextResponse.json(
          {
            success: false,
            error: 'Subscription not found',
            message: 'The specified subscription does not exist or you do not have permission to access it',
          },
          { status: 404 }
        )
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        subscriptionId,
        type,
        amount,
        currency: 'IDR',
        status: 'pending',
        description,
        paymentMethod,
        baseAmount: amount,
        totalAmount: amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
      },
      include: {
        subscription: {
          include: {
            package: true,
          },
        },
      },
    })

    // TODO: Integrate with payment gateway
    // For now, return mock payment URL
    const paymentUrl = `https://payment-gateway.example.com/pay/${transaction.id}`

    // Update transaction with payment URL
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        paymentUrl,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expire in 24 hours
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        transaction: {
          ...transaction,
          paymentUrl,
          expiredAt: transaction.expiredAt,
        },
      },
      message: 'Transaction created successfully. Please complete payment.',
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}