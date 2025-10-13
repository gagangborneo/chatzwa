import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.knowledgeCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            documents: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category
    })

  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, color, icon, sortOrder, isActive } = body

    // Check if category exists
    const existingCategory = await prisma.knowledgeCategory.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    // Check if name conflicts with another category
    if (name && name.trim() !== existingCategory.name) {
      const nameConflict = await prisma.knowledgeCategory.findFirst({
        where: {
          name: name.trim(),
          id: { not: id }
        }
      })

      if (nameConflict) {
        return NextResponse.json({
          success: false,
          error: 'Category with this name already exists'
        }, { status: 409 })
      }
    }

    const category = await prisma.knowledgeCategory.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(color && { color }),
        ...(icon !== undefined && { icon }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    })

  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if category exists
    const existingCategory = await prisma.knowledgeCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            documents: true
          }
        }
      }
    })

    if (!existingCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    // Check if category has documents
    if (existingCategory._count.documents > 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete category with associated documents. Please move or delete the documents first.'
      }, { status: 400 })
    }

    await prisma.knowledgeCategory.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}