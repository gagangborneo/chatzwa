import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { validateSession } from '@/lib/auth'

const prisma = new PrismaClient()

// Helper function to extract token and validate user
const getUserFromRequest = async (request: NextRequest) => {
  // Get token from request headers or cookies
  const authHeader = request.headers.get('authorization')
  const cookieHeader = request.headers.get('cookie')

  let token = null

  // Try to get token from Authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // Try to get token from cookies
  if (!token && cookieHeader) {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
    const authCookie = cookies.find(cookie => cookie.startsWith('auth-token='))
    if (authCookie) {
      token = authCookie.substring('auth-token='.length)
    }
  }

  if (!token) {
    return null
  }

  // Validate token and get user
  return await validateSession(token)
}

// POST toggle chatbot active status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if chatbot exists and belongs to user
    const existingPersona = await prisma.persona.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingPersona) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    // Toggle active status
    const updatedPersona = await prisma.persona.update({
      where: { id: params.id },
      data: {
        isActive: !existingPersona.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPersona.id,
        isActive: updatedPersona.isActive,
        message: updatedPersona.isActive
          ? 'Chatbot activated successfully'
          : 'Chatbot deactivated successfully'
      }
    })

  } catch (error) {
    console.error('Error toggling chatbot status:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}