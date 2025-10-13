import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const document = await prisma.knowledgeDocument.findUnique({
      where: { id },
      include: {
        category: true,
        uploadRecords: true
      }
    })

    if (!document) {
      return NextResponse.json({
        success: false,
        error: 'Document not found'
      }, { status: 404 })
    }

    // Increment view count
    await prisma.knowledgeDocument.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json({
      success: true,
      data: { ...document, viewCount: document.viewCount + 1 }
    })

  } catch (error) {
    console.error('Error fetching document:', error)
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
    const {
      title,
      content,
      description,
      categoryId,
      author,
      tags,
      keywords,
      priority,
      status
    } = body

    // Check if document exists
    const existingDocument = await prisma.knowledgeDocument.findUnique({
      where: { id }
    })

    if (!existingDocument) {
      return NextResponse.json({
        success: false,
        error: 'Document not found'
      }, { status: 404 })
    }

    const document = await prisma.knowledgeDocument.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(content && { content: content.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(author !== undefined && { author: author?.trim() || null }),
        ...(tags !== undefined && { tags: tags?.trim() || null }),
        ...(keywords !== undefined && { keywords: keywords?.trim() || null }),
        ...(priority !== undefined && { priority: Number(priority) }),
        ...(status && { status })
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: document
    })

  } catch (error) {
    console.error('Error updating document:', error)
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

    // Check if document exists
    const existingDocument = await prisma.knowledgeDocument.findUnique({
      where: { id }
    })

    if (!existingDocument) {
      return NextResponse.json({
        success: false,
        error: 'Document not found'
      }, { status: 404 })
    }

    await prisma.knowledgeDocument.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}