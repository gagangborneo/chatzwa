import { PrismaClient } from '@prisma/client'
import { PaymentGateway, PaymentRequest, PaymentResponse, WebhookPayload, PaymentGatewayFactory } from './gateway'

const prisma = new PrismaClient()

export class PaymentService {
  private gateway: PaymentGateway

  constructor(gatewayName: string = 'midtrans') {
    const gateway = PaymentGatewayFactory.getGateway(gatewayName)
    if (!gateway) {
      throw new Error(`Payment gateway '${gatewayName}' not found or not initialized`)
    }
    this.gateway = gateway
  }

  async createPaymentForTransaction(transactionId: string): Promise<PaymentResponse> {
    try {
      // Get transaction details
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          subscription: {
            include: {
              package: true,
            },
          },
        },
      })

      if (!transaction) {
        return {
          success: false,
          status: 'error',
          error: 'Transaction not found',
        }
      }

      // Prepare payment request
      const paymentRequest: PaymentRequest = {
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        customerEmail: transaction.user.email,
        customerName: transaction.user.name || 'Customer',
        orderId: transaction.id,
        paymentMethod: transaction.paymentMethod || 'credit_card',
        metadata: {
          subscriptionId: transaction.subscriptionId,
          userId: transaction.userId,
          type: transaction.type,
        },
      }

      // Create payment with gateway
      const paymentResponse = await this.gateway.createPayment(paymentRequest)

      if (paymentResponse.success) {
        // Update transaction with gateway response
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            externalTransactionId: paymentResponse.transactionId,
            paymentUrl: paymentResponse.paymentUrl,
            expiredAt: paymentResponse.expiresAt,
            status: 'processing',
            gatewayResponse: {
              gateway: this.gateway.constructor.name,
              response: paymentResponse,
            },
          },
        })
      }

      return paymentResponse
    } catch (error) {
      console.error('Error creating payment:', error)
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        select: { externalTransactionId: true },
      })

      if (!transaction?.externalTransactionId) {
        return {
          success: false,
          status: 'error',
          error: 'Transaction not found or no external transaction ID',
        }
      }

      const statusResponse = await this.gateway.getStatus(transaction.externalTransactionId)

      if (statusResponse.success && statusResponse.status !== 'pending') {
        // Update transaction status
        await this.updateTransactionStatus(transactionId, statusResponse)
      }

      return statusResponse
    } catch (error) {
      console.error('Error checking payment status:', error)
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        select: { externalTransactionId: true },
      })

      if (!transaction?.externalTransactionId) {
        return {
          success: false,
          status: 'error',
          error: 'Transaction not found or no external transaction ID',
        }
      }

      const cancelResponse = await this.gateway.cancelTransaction(transaction.externalTransactionId)

      if (cancelResponse.success) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status: 'cancelled',
          },
        })
      }

      return cancelResponse
    } catch (error) {
      console.error('Error cancelling payment:', error)
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<PaymentResponse> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        select: { externalTransactionId: true },
      })

      if (!transaction?.externalTransactionId) {
        return {
          success: false,
          status: 'error',
          error: 'Transaction not found or no external transaction ID',
        }
      }

      const refundResponse = await this.gateway.refundTransaction(transaction.externalTransactionId, amount)

      if (refundResponse.success) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            status: 'refunded',
            refundedAt: new Date(),
            refundReason: 'Refund processed via payment gateway',
          },
        })
      }

      return refundResponse
    } catch (error) {
      console.error('Error processing refund:', error)
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async processWebhook(payload: any, signature: string): Promise<boolean> {
    try {
      // Verify webhook signature
      if (!this.gateway.verifyWebhook(payload, signature)) {
        console.error('Invalid webhook signature')
        return false
      }

      // Parse webhook payload
      const webhookData = this.gateway.parseWebhook(payload)

      // Find transaction by external ID or order ID
      const transaction = await prisma.transaction.findFirst({
        where: {
          OR: [
            { externalTransactionId: webhookData.externalTransactionId },
            { id: webhookData.transactionId },
          ],
        },
        include: {
          subscription: true,
        },
      })

      if (!transaction) {
        console.error('Transaction not found for webhook:', webhookData)
        return false
      }

      // Update transaction status
      await this.updateTransactionFromWebhook(transaction.id, webhookData)

      console.log('Webhook processed successfully:', webhookData)
      return true
    } catch (error) {
      console.error('Error processing webhook:', error)
      return false
    }
  }

  private async updateTransactionStatus(transactionId: string, statusResponse: PaymentResponse): Promise<void> {
    const updateData: any = {
      status: statusResponse.status,
    }

    if (statusResponse.paidAt) {
      updateData.paidAt = statusResponse.paidAt
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
    })

    // If payment is completed, handle post-payment actions
    if (statusResponse.status === 'completed') {
      await this.handleSuccessfulPayment(transactionId)
    }
  }

  private async updateTransactionFromWebhook(transactionId: string, webhookData: WebhookPayload): Promise<void> {
    const updateData: any = {
      status: webhookData.status,
      gatewayResponse: {
        webhook: webhookData,
      },
    }

    if (webhookData.paidAt) {
      updateData.paidAt = webhookData.paidAt
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: updateData,
      include: {
        subscription: true,
      },
    })

    // If payment is completed, handle post-payment actions
    if (webhookData.status === 'completed') {
      await this.handleSuccessfulPayment(transactionId)
    }
  }

  private async handleSuccessfulPayment(transactionId: string): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        subscription: {
          include: {
            package: true,
          },
        },
      },
    })

    if (!transaction) return

    // Activate subscription if this is a new subscription payment
    if (transaction.type === 'subscription' && transaction.subscriptionId) {
      await prisma.subscription.update({
        where: { id: transaction.subscriptionId },
        data: {
          status: 'active',
        },
      })
    }

    // Handle renewal payments
    if (transaction.type === 'renewal' && transaction.subscriptionId) {
      const subscription = transaction.subscription
      const now = new Date()
      let nextBillingDate: Date | null = null

      if (subscription.package.billingCycle === 'monthly') {
        nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      } else if (subscription.package.billingCycle === 'yearly') {
        nextBillingDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      }

      if (nextBillingDate) {
        await prisma.subscription.update({
          where: { id: transaction.subscriptionId },
          data: {
            status: 'active',
            nextBillingDate,
            renewalAttempts: 0, // Reset renewal attempts
            usageResetAt: subscription.package.billingCycle === 'monthly' ? nextBillingDate : null,
          },
        })
      }
    }

    // Create invoice if one doesn't exist
    if (!transaction.invoiceId) {
      await this.createInvoiceForTransaction(transaction)
    }
  }

  private async createInvoiceForTransaction(transaction: any): Promise<void> {
    try {
      const invoiceNumber = await this.generateInvoiceNumber()

      const invoice = await prisma.invoice.create({
        data: {
          userId: transaction.userId,
          subscriptionId: transaction.subscriptionId,
          invoiceNumber,
          type: transaction.type,
          status: 'paid',
          description: transaction.description,
          periodStartDate: transaction.subscription?.startDate,
          periodEndDate: transaction.subscription?.endDate,
          dueDate: transaction.dueDate || new Date(),
          issuedAt: new Date(),
          paidAt: transaction.paidAt || new Date(),
          subtotal: transaction.baseAmount,
          discountAmount: transaction.discountAmount,
          taxAmount: transaction.taxAmount,
          totalAmount: transaction.totalAmount,
          currency: transaction.currency,
          paymentMethod: transaction.paymentMethod,
          items: [
            {
              description: transaction.description,
              quantity: 1,
              unitPrice: transaction.baseAmount,
              total: transaction.totalAmount,
            },
          ],
        },
      })

      // Link invoice to transaction
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          invoiceId: invoice.id,
        },
      })
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')

    // Get last invoice number for this month
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: `INV/${year}${month}`,
        },
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    })

    let sequence = 1
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('/')[2]) || 0
      sequence = lastSequence + 1
    }

    return `INV/${year}${month}/${sequence.toString().padStart(4, '0')}`
  }
}

// Initialize payment gateways (this should be called during app startup)
export function initializePaymentGateways(): void {
  const configs: any[] = [
    {
      name: 'midtrans',
      enabled: process.env.MIDTRANS_ENABLED === 'true',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      credentials: {
        serverKey: process.env.MIDTRANS_SERVER_KEY || '',
        clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
      },
      webhooks: {
        payment_status: process.env.MIDTRANS_WEBHOOK_URL || '',
      },
      settings: {
        enabled_payments: ['credit_card', 'bank_transfer', 'gopay', 'shopeepay'],
        expiry: {
          unit: 'hours',
          duration: 24,
        },
      },
    },
    // Add Xendit configuration when needed
  ]

  PaymentGatewayFactory.initialize(configs)
}

// Export service factory
export function createPaymentService(gatewayName: string = 'midtrans'): PaymentService {
  return new PaymentService(gatewayName)
}