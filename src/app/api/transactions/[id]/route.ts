import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to view transaction details',
        },
        { status: 401 }
      )
    }

    const transactionId = params.id

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: session.user.id, // Only allow user to view their own transactions
      },
      include: {
        subscription: {
          include: {
            package: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        invoice: true,
        user: false, // Don't include user data
      },
    })

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction not found',
          message: 'The requested transaction does not exist or you do not have permission to view it',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction,
      },
    })
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to update transaction',
        },
        { status: 401 }
      )
    }

    const transactionId = params.id
    const body = await request.json()
    const {
      status,
      gatewayResponse,
      externalTransactionId,
    } = body

    // Verify transaction belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: session.user.id,
      },
    })

    if (!existingTransaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction not found',
          message: 'The requested transaction does not exist or you do not have permission to modify it',
        },
        { status: 404 }
      )
    }

    // Validate status transition
    const validStatusTransitions: { [key: string]: string[] } = {
      pending: ['processing', 'completed', 'failed', 'cancelled'],
      processing: ['completed', 'failed', 'cancelled'],
      completed: ['refunded'],
      failed: ['pending'], // Allow retry
      cancelled: [], // No transitions from cancelled
      refunded: [], // No transitions from refunded
    }

    if (status && validStatusTransitions[existingTransaction.status] &&
        !validStatusTransitions[existingTransaction.status].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status transition',
          message: `Cannot transition from ${existingTransaction.status} to ${status}`,
        },
        { status: 400 }
      )
    }

    const updateData: any = {}

    if (status) {
      updateData.status = status

      // Set timestamps based on status
      if (status === 'completed') {
        updateData.paidAt = new Date()
      } else if (status === 'failed') {
        updateData.failedAt = new Date()
      } else if (status === 'refunded') {
        updateData.refundedAt = new Date()
        updateData.refundReason = body.refundReason || 'Customer requested refund'
      }
    }

    if (gatewayResponse) {
      updateData.gatewayResponse = gatewayResponse
    }

    if (externalTransactionId) {
      updateData.externalTransactionId = externalTransactionId
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      include: {
        subscription: {
          include: {
            package: true,
          },
        },
        invoice: true,
      },
    })

    // If transaction is completed and it's a subscription payment, activate the subscription
    if (status === 'completed' && existingTransaction.type === 'subscription' && existingTransaction.subscriptionId) {
      await prisma.subscription.update({
        where: { id: existingTransaction.subscriptionId },
        data: {
          status: 'active',
        },
      })
    }

    // If transaction is completed and it's a renewal, update next billing date
    if (status === 'completed' && existingTransaction.type === 'renewal' && existingTransaction.subscriptionId) {
      const subscription = await prisma.subscription.findUnique({
        where: { id: existingTransaction.subscriptionId },
        include: { package: true },
      })

      if (subscription) {
        const now = new Date()
        let nextBillingDate: Date | null = null

        if (subscription.package.billingCycle === 'monthly') {
          nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        } else if (subscription.package.billingCycle === 'yearly') {
          nextBillingDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
        }

        if (nextBillingDate) {
          await prisma.subscription.update({
            where: { id: existingTransaction.subscriptionId },
            data: {
              nextBillingDate,
              renewalAttempts: 0, // Reset renewal attempts on successful renewal
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction: updatedTransaction,
      },
      message: 'Transaction updated successfully',
    })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update transaction',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}