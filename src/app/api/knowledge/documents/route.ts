import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const isIndexed = searchParams.get('isIndexed')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (isIndexed === 'true') {
      where.isIndexed = true
    } else if (isIndexed === 'false') {
      where.isIndexed = false
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
        { keywords: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get documents with pagination
    const [documents, total] = await Promise.all([
      prisma.knowledgeDocument.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: limit
      }),
      prisma.knowledgeDocument.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: documents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      description,
      categoryId,
      author,
      source = 'manual',
      tags,
      keywords,
      priority = 0,
      status = 'draft'
    } = body

    if (!title || title.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Document title is required'
      }, { status: 400 })
    }

    if (!content || content.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Document content is required'
      }, { status: 400 })
    }

    const document = await prisma.knowledgeDocument.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        description: description?.trim() || null,
        categoryId: categoryId || null,
        author: author?.trim() || null,
        source,
        tags: tags?.trim() || null,
        keywords: keywords?.trim() || null,
        priority: Number(priority) || 0,
        status,
        isIndexed: false,
        embeddingCount: 0,
        viewCount: 0
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
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}