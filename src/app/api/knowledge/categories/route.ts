import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'

    const categories = await prisma.knowledgeCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: {
            documents: true
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: categories
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, color, icon, sortOrder = 0 } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, { status: 400 })
    }

    // Check if category already exists
    const existingCategory = await prisma.knowledgeCategory.findFirst({
      where: { name: name.trim() }
    })

    if (existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category with this name already exists'
      }, { status: 409 })
    }

    const category = await prisma.knowledgeCategory.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#6B7280',
        icon: icon || null,
        sortOrder: Number(sortOrder) || 0,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}