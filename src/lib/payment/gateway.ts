// Payment Gateway Integration Types
export interface PaymentGatewayConfig {
  name: string
  enabled: boolean
  environment: 'sandbox' | 'production'
  credentials: {
    [key: string]: string
  }
  webhooks: {
    [key: string]: string
  }
  settings: {
    [key: string]: any
  }
}

export interface PaymentRequest {
  amount: number
  currency: string
  description: string
  customerEmail: string
  customerName: string
  orderId: string
  paymentMethod: string
  items?: PaymentItem[]
  metadata?: {
    [key: string]: any
  }
}

export interface PaymentItem {
  id: string
  name: string
  price: number
  quantity: number
  category?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  qrCode?: string
  virtualAccount?: {
    bank: string
    accountNumber: string
    accountName: string
  }
  ewallet?: {
    provider: string
    phone: string
    deepLink: string
  }
  expiresAt?: Date
  status: string
  message?: string
  error?: string
}

export interface WebhookPayload {
  transactionId: string
  externalTransactionId: string
  status: string
  amount: number
  currency: string
  paymentMethod: string
  paidAt?: Date
  failureReason?: string
  metadata?: {
    [key: string]: any
  }
  signature: string
}

// Abstract Payment Gateway Class
export abstract class PaymentGateway {
  protected config: PaymentGatewayConfig

  constructor(config: PaymentGatewayConfig) {
    this.config = config
  }

  abstract createPayment(request: PaymentRequest): Promise<PaymentResponse>
  abstract getStatus(transactionId: string): Promise<PaymentResponse>
  abstract cancelTransaction(transactionId: string): Promise<PaymentResponse>
  abstract refundTransaction(transactionId: string, amount?: number): Promise<PaymentResponse>
  abstract verifyWebhook(payload: any, signature: string): boolean
  abstract parseWebhook(payload: any): WebhookPayload

  protected generateOrderId(prefix: string = 'TRX'): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}${timestamp}${random}`
  }

  protected formatAmount(amount: number): number {
    // Convert to smallest currency unit (e.g., cents for USD, but for IDR we keep as is)
    return Math.round(amount)
  }
}

// Midtrans Implementation
export class MidtransGateway extends PaymentGateway {
  private apiUrl: string
  private serverKey: string

  constructor(config: PaymentGatewayConfig) {
    super(config)
    this.apiUrl = config.environment === 'production'
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2'
    this.serverKey = config.credentials.serverKey
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const orderId = this.generateOrderId('MTX')

      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: this.formatAmount(request.amount),
        },
        item_details: request.items || [
          {
            id: request.orderId,
            price: request.amount,
            quantity: 1,
            name: request.description,
          },
        ],
        customer_details: {
          first_name: request.customerName,
          email: request.customerEmail,
        },
        enabled_payments: this.getEnabledPaymentMethods(request.paymentMethod),
        expiry: {
          unit: 'hours',
          duration: 24,
        },
        custom_field1: request.metadata?.subscriptionId,
        custom_field2: request.metadata?.userId,
      }

      const response = await fetch(`${this.apiUrl}/charge`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          transactionId: data.transaction_id,
          paymentUrl: data.redirect_url,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'pending',
        }
      } else {
        return {
          success: false,
          status: 'error',
          error: data.error_messages?.join(', ') || 'Payment creation failed',
        }
      }
    } catch (error) {
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          transactionId: data.transaction_id,
          status: this.mapMidtransStatus(data.transaction_status),
          paidAt: data.settlement_time ? new Date(data.settlement_time) : undefined,
        }
      } else {
        return {
          success: false,
          status: 'error',
          error: data.error_messages?.join(', ') || 'Status check failed',
        }
      }
    } catch (error) {
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async cancelTransaction(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/${transactionId}/cancel`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
      })

      const data = await response.json()

      return {
        success: response.ok,
        transactionId,
        status: response.ok ? 'cancelled' : 'error',
        message: response.ok ? 'Transaction cancelled successfully' : data.error_messages?.join(', '),
      }
    } catch (error) {
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async refundTransaction(transactionId: string, amount?: number): Promise<PaymentResponse> {
    try {
      const payload = amount ? { amount } : {}

      const response = await fetch(`${this.apiUrl}/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      return {
        success: response.ok,
        transactionId,
        status: response.ok ? 'refunded' : 'error',
        message: response.ok ? 'Refund processed successfully' : data.error_messages?.join(', '),
      }
    } catch (error) {
      return {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // Implement Midtrans webhook signature verification
    const crypto = require('crypto')
    const hashedPayload = crypto.createHash('sha512').update(JSON.stringify(payload)).digest('hex')
    return hashedPayload === signature
  }

  parseWebhook(payload: any): WebhookPayload {
    return {
      transactionId: payload.order_id,
      externalTransactionId: payload.transaction_id,
      status: this.mapMidtransStatus(payload.transaction_status),
      amount: payload.gross_amount,
      currency: 'IDR',
      paymentMethod: payload.payment_type,
      paidAt: payload.settlement_time ? new Date(payload.settlement_time) : undefined,
      failureReason: payload.status_message,
      metadata: {
        custom_field1: payload.custom_field1,
        custom_field2: payload.custom_field2,
      },
      signature: payload.signature_key,
    }
  }

  private getEnabledPaymentMethods(method: string): string[] {
    const methodMap: { [key: string]: string[] } = {
      credit_card: ['credit_card'],
      bank_transfer: ['bank_transfer'],
      ewallet: ['gopay', 'shopeepay', 'other_qris'],
      virtual_account: ['permata_va', 'bca_va', 'bni_va', 'bri_va'],
      all: ['credit_card', 'bank_transfer', 'gopay', 'shopeepay', 'permata_va', 'bca_va', 'bni_va', 'bri_va', 'other_qris'],
    }
    return methodMap[method] || methodMap.all
  }

  private mapMidtransStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'capture': 'completed',
      'settlement': 'completed',
      'pending': 'pending',
      'deny': 'failed',
      'cancel': 'cancelled',
      'expire': 'failed',
      'refund': 'refunded',
    }
    return statusMap[status] || 'pending'
  }
}

// Xendit Implementation (similar structure)
export class XenditGateway extends PaymentGateway {
  // Implementation similar to Midtrans but with Xendit-specific API calls
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Xendit implementation
    return {
      success: false,
      status: 'error',
      error: 'Xendit implementation not yet available',
    }
  }

  async getStatus(transactionId: string): Promise<PaymentResponse> {
    // Xendit implementation
    return {
      success: false,
      status: 'error',
      error: 'Xendit implementation not yet available',
    }
  }

  async cancelTransaction(transactionId: string): Promise<PaymentResponse> {
    // Xendit implementation
    return {
      success: false,
      status: 'error',
      error: 'Xendit implementation not yet available',
    }
  }

  async refundTransaction(transactionId: string, amount?: number): Promise<PaymentResponse> {
    // Xendit implementation
    return {
      success: false,
      status: 'error',
      error: 'Xendit implementation not yet available',
    }
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // Xendit webhook verification
    return false
  }

  parseWebhook(payload: any): WebhookPayload {
    // Xendit webhook parsing
    return {
      transactionId: '',
      externalTransactionId: '',
      status: '',
      amount: 0,
      currency: '',
      paymentMethod: '',
      signature: '',
    }
  }
}

// Payment Gateway Factory
export class PaymentGatewayFactory {
  private static gateways: { [key: string]: PaymentGateway } = {}

  static initialize(configs: PaymentGatewayConfig[]): void {
    configs.forEach(config => {
      if (!config.enabled) return

      switch (config.name.toLowerCase()) {
        case 'midtrans':
          this.gateways.midtrans = new MidtransGateway(config)
          break
        case 'xendit':
          this.gateways.xendit = new XenditGateway(config)
          break
        default:
          console.warn(`Unknown payment gateway: ${config.name}`)
      }
    })
  }

  static getGateway(name: string): PaymentGateway | null {
    return this.gateways[name.toLowerCase()] || null
  }

  static getDefaultGateway(): PaymentGateway | null {
    const availableGateways = Object.keys(this.gateways)
    return availableGateways.length > 0 ? this.gateways[availableGateways[0]] : null
  }

  static getAvailableGateways(): string[] {
    return Object.keys(this.gateways)
  }
}