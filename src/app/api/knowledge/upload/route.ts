import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const categoryId = formData.get('categoryId') as string
    const autoIndex = formData.get('autoIndex') === 'true'
    const extractText = formData.get('extractText') !== 'false'
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size exceeds 10MB limit'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/markdown',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Unsupported file type. Supported types: PDF, DOCX, DOC, TXT, MD, CSV'
      }, { status: 400 })
    }

    // Create upload record
    const uploadId = uuidv4()
    const fileName = `${uploadId}_${file.name}`
    const uploadsDir = join(process.cwd(), 'uploads', 'documents')

    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true })

    const filePath = join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create document upload record
    const uploadRecord = await prisma.documentUpload.create({
      data: {
        id: uploadId,
        fileName,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        filePath,
        status: 'processing',
        autoIndex,
        categoryId: categoryId || null,
        extractText,
        uploadSource: 'manual',
        processingLog: JSON.stringify({
          steps: ['File uploaded successfully'],
          timestamp: new Date().toISOString()
        })
      }
    })

    // Extract text content (mock for now - in real implementation, you'd use PDF parsers, etc.)
    let extractedText = ''
    try {
      // This is a mock implementation
      // In a real app, you'd use libraries like:
      // - pdf-parse for PDF files
      // - mammoth for DOCX files
      // - or other text extraction libraries
      extractedText = `Extracted text from ${file.name}. This is a mock implementation.`

      if (extractText) {
        // Create document record
        const document = await prisma.knowledgeDocument.create({
          data: {
            title: title || file.name.replace(/\.[^/.]+$/, ''),
            content: extractedText,
            description: description || `Document uploaded from ${file.name}`,
            categoryId: categoryId || null,
            author: 'System Upload',
            source: 'upload',
            filePath,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            format: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
            status: autoIndex ? 'processing' : 'draft',
            isIndexed: false,
            embeddingCount: 0,
            viewCount: 0,
            tags: tags || null,
            priority: 0
          }
        })

        // Link upload to document
        await prisma.documentUpload.update({
          where: { id: uploadId },
          data: {
            documentId: document.id,
            status: 'completed',
            completedAt: new Date(),
            processingLog: JSON.stringify({
              steps: [
                'File uploaded successfully',
                'Text extracted successfully',
                'Document created successfully'
              ],
              timestamp: new Date().toISOString(),
              documentId: document.id
            })
          }
        })

        // Trigger RAG indexing if autoIndex is enabled
        if (autoIndex) {
          // This would be handled by a background job in production
          // For now, we'll just mark it as ready for indexing
          console.log(`Document ${document.id} ready for RAG indexing`)
        }

        return NextResponse.json({
          success: true,
          data: {
            upload: uploadRecord,
            document
          }
        }, { status: 201 })

      } else {
        // Update upload record with error
        await prisma.documentUpload.update({
          where: { id: uploadId },
          data: {
            status: 'failed',
            errorMessage: 'Failed to extract text from file',
            processingLog: JSON.stringify({
              steps: ['File uploaded successfully', 'Text extraction failed'],
              timestamp: new Date().toISOString(),
              error: 'Text extraction failed'
            })
          }
        })

        return NextResponse.json({
          success: false,
          error: 'Failed to extract text from file'
        }, { status: 500 })
      }

    } catch (extractError) {
      console.error('Text extraction error:', extractError)

      // Update upload record with error
      await prisma.documentUpload.update({
        where: { id: uploadId },
        data: {
          status: 'failed',
          errorMessage: extractError instanceof Error ? extractError.message : 'Text extraction failed',
          processingLog: JSON.stringify({
            steps: ['File uploaded successfully', 'Text extraction failed'],
            timestamp: new Date().toISOString(),
            error: extractError instanceof Error ? extractError.message : 'Unknown error'
          })
        }
      })

      return NextResponse.json({
        success: false,
        error: 'Failed to extract text from file'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }, { status: 500 })
  }
}