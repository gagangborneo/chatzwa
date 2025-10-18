import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unifiedAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to view WordPress integration',
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

    const integrationId = params.integrationId

    // Get WordPress integration
    const wordpressIntegration = await prisma.wordpressIntegration.findFirst({
      where: {
        id: integrationId,
        userId: user.id,
      },
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
            description: true,
            apiKey: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    })

    if (!wordpressIntegration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Integration not found',
          message: 'The specified WordPress integration does not exist or you do not have permission to access it',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: wordpressIntegration,
      message: 'WordPress integration retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching WordPress integration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch WordPress integration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to update WordPress integration',
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

    const integrationId = params.integrationId
    const body = await request.json()
    const {
      name,
      url,
      status,
      settings,
    } = body

    // Check if integration exists and belongs to user
    const existingIntegration = await prisma.wordpressIntegration.findFirst({
      where: {
        id: integrationId,
        userId: user.id,
      },
    })

    if (!existingIntegration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Integration not found',
          message: 'The specified WordPress integration does not exist or you do not have permission to update it',
        },
        { status: 404 }
      )
    }

    // Check if new name conflicts with existing integrations (excluding this one)
    if (name && name !== existingIntegration.name) {
      const nameConflict = await prisma.wordpressIntegration.findFirst({
        where: {
          userId: user.id,
          name,
          id: { not: integrationId },
        },
      })

      if (nameConflict) {
        return NextResponse.json(
          {
            success: false,
            error: 'Integration name already exists',
            message: 'An integration with this name already exists',
          },
          { status: 409 }
        )
      }
    }

    // Update WordPress integration
    const updatedIntegration = await prisma.wordpressIntegration.update({
      where: {
        id: integrationId,
      },
      data: {
        ...(name && { name }),
        ...(url !== undefined && { url }),
        ...(status && { status }),
        ...(settings && { settings }),
        updatedAt: new Date(),
      },
      include: {
        chatbot: {
          select: {
            id: true,
            name: true,
            description: true,
            apiKey: true,
          },
        },
        _count: {
          select: {
            sessions: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedIntegration,
      message: 'WordPress integration updated successfully',
    })
  } catch (error) {
    console.error('Error updating WordPress integration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update WordPress integration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to delete WordPress integration',
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

    const integrationId = params.integrationId

    // Check if integration exists and belongs to user
    const existingIntegration = await prisma.wordpressIntegration.findFirst({
      where: {
        id: integrationId,
        userId: user.id,
      },
    })

    if (!existingIntegration) {
      return NextResponse.json(
        {
          success: false,
          error: 'Integration not found',
          message: 'The specified WordPress integration does not exist or you do not have permission to delete it',
        },
        { status: 404 }
      )
    }

    // Delete WordPress integration
    await prisma.wordpressIntegration.delete({
      where: {
        id: integrationId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'WordPress integration deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting WordPress integration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete WordPress integration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}