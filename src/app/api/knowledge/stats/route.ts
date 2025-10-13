import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get document statistics
    const [
      totalDocuments,
      publishedDocuments,
      draftDocuments,
      indexedDocuments,
      totalViews
    ] = await Promise.all([
      prisma.knowledgeDocument.count(),
      prisma.knowledgeDocument.count({ where: { status: 'published' } }),
      prisma.knowledgeDocument.count({ where: { status: 'draft' } }),
      prisma.knowledgeDocument.count({ where: { isIndexed: true } }),
      prisma.knowledgeDocument.aggregate({ _sum: { viewCount: true } })
    ])

    // Get category statistics
    const categories = await prisma.knowledgeCategory.findMany({
      include: {
        _count: {
          select: {
            documents: true
          }
        }
      },
      orderBy: {
        documents: {
          _count: 'desc'
        }
      },
      take: 10
    })

    // Get recent documents
    const recentDocuments = await prisma.knowledgeDocument.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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

    // Get popular documents (by views)
    const popularDocuments = await prisma.knowledgeDocument.findMany({
      take: 5,
      orderBy: { viewCount: 'desc' },
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

    // Get storage statistics (mock for now)
    const storageStats = {
      totalSize: 0, // Would calculate from actual file sizes
      usedSize: 0, // Would calculate from uploaded files
      availableSize: 5 * 1024 * 1024 * 1024 // 5GB mock limit
    }

    return NextResponse.json({
      success: true,
      data: {
        documents: {
          total: totalDocuments,
          published: publishedDocuments,
          draft: draftDocuments,
          indexed: indexedDocuments,
          totalViews: totalViews._sum.viewCount || 0
        },
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
          documentCount: cat._count.documents
        })),
        recentDocuments,
        popularDocuments,
        storage: storageStats
      }
    })

  } catch (error) {
    console.error('Error fetching knowledge stats:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}