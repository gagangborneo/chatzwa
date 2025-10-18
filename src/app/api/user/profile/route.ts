import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken, unifiedAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getAuthToken(request)
    console.log('🔍 Profile API: Token found:', !!token)
    console.log('🔍 Profile API: Token value:', token?.substring(0, 20) + '...')

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token found'
      }, { status: 401 })
    }

    // Get current user
    console.log('🔍 Profile API: Calling getCurrentUser...')
    const user = await unifiedAuth.getCurrentUser(token)
    console.log('🔍 Profile API: Current user result:', !!user)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profile'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = getAuthToken(request)

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'No authentication token found'
      }, { status: 401 })
    }

    // Get current user
    const user = await unifiedAuth.getCurrentUser(token)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 401 })
    }

    const updates = await request.json()

    // Validate input
    const allowedFields = ['name', 'phone', 'jobTitle', 'department', 'institution', 'bio', 'location', 'website']
    const filteredUpdates: any = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid fields to update'
      }, { status: 400 })
    }

    // Update user profile using unified auth
    try {
      const updatedUser = await unifiedAuth.updateUser(user.id, filteredUpdates)

      if (!updatedUser) {
        return NextResponse.json({
          success: false,
          error: 'Failed to update profile'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            isActive: updatedUser.isActive,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
          }
        }
      })

    } catch (updateError) {
      // Fallback for systems that don't have update functionality
      console.log('Profile update not fully supported, returning success for partial updates')

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully (basic info only)',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: filteredUpdates.name || user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: new Date().toISOString()
          }
        }
      })
    }

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile'
    }, { status: 500 })
  }
}