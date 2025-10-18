import { NextRequest, NextResponse } from 'next/server'
import { createPaymentService } from '@/lib/payment/service'

export async function POST(
  request: NextRequest,
  { params }: { params: { gateway: string } }
) {
  try {
    const gateway = params.gateway
    const body = await request.text()
    const signature = request.headers.get('x-signature') || request.headers.get('signature') || ''

    console.log(`Received webhook from ${gateway} gateway`)
    console.log('Signature:', signature)
    console.log('Body:', body)

    if (!signature) {
      console.error('Missing signature header')
      return NextResponse.json(
        {
          success: false,
          error: 'Missing signature',
        },
        { status: 400 }
      )
    }

    // Parse the body based on content type
    let payload
    const contentType = request.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      payload = JSON.parse(body)
    } else {
      // Handle form-encoded data
      payload = body
    }

    // Create payment service and process webhook
    const paymentService = createPaymentService(gateway)
    const success = await paymentService.processWebhook(payload, signature)

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process webhook',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}