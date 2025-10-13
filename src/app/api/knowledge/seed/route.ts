import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  try {
    // Create default categories if they don't exist
    const defaultCategories = [
      {
        name: 'Islamic Studies',
        description: 'Islamic education, theology, and religious studies',
        color: '#10B981', // green-500
        icon: '🕌',
        sortOrder: 1
      },
      {
        name: 'Education',
        description: 'General education materials and curriculum',
        color: '#3B82F6', // blue-500
        icon: '📚',
        sortOrder: 2
      },
      {
        name: 'Donation Programs',
        description: 'Charity and donation program information',
        color: '#8B5CF6', // purple-500
        icon: '❤️',
        sortOrder: 3
      },
      {
        name: 'Quran Learning',
        description: 'Quranic studies and learning materials',
        color: '#F97316', // orange-500
        icon: '📖',
        sortOrder: 4
      },
      {
        name: 'General',
        description: 'General knowledge and miscellaneous documents',
        color: '#6B7280', // gray-500
        icon: '📄',
        sortOrder: 5
      }
    ]

    for (const category of defaultCategories) {
      await prisma.knowledgeCategory.upsert({
        where: { name: category.name },
        update: category,
        create: category
      })
    }

    // Create some sample documents
    const sampleDocuments = [
      {
        title: 'Introduction to Islamic Education',
        content: `This is a comprehensive introduction to Islamic education principles and methodologies.
        Islamic education is based on the teachings of the Quran and Sunnah, emphasizing moral development,
        spiritual growth, and academic excellence. The curriculum typically includes Arabic language studies,
        Quranic memorization, Islamic history, and the teachings of Prophet Muhammad (peace be upon him).`,
        description: 'A comprehensive guide to Islamic education fundamentals',
        author: 'Education Team',
        tags: 'islamic, education, fundamentals',
        keywords: 'islamic education, quran, sunnah, curriculum',
        status: 'published' as const,
        priority: 1
      },
      {
        title: 'Donation Guidelines and Procedures',
        content: `This document outlines the proper procedures for accepting and managing donations in accordance
        with Islamic principles. All donations must be handled with transparency and accountability, ensuring that
        funds are used for their intended charitable purposes. The guidelines cover donation types, documentation
        requirements, and distribution procedures.`,
        description: 'Guidelines for handling charitable donations',
        author: 'Donation Committee',
        tags: 'donation, charity, guidelines, procedures',
        keywords: 'donation, charity, islamic principles, transparency',
        status: 'published' as const,
        priority: 2
      },
      {
        title: 'Quran Memorization Techniques',
        content: `Effective techniques for memorizing the Holy Quran. This guide covers proven methods such as
        repetition, understanding the meaning, and consistent review schedules. It also includes tips for
        maintaining what has been memorized and avoiding common mistakes in the memorization process.`,
        description: 'A guide to effective Quran memorization',
        author: 'Quran Teachers',
        tags: 'quran, memorization, techniques, hifz',
        keywords: 'quran memorization, hifz, islamic education',
        status: 'draft' as const,
        priority: 1
      }
    ]

    // Get categories to link documents
    const categories = await prisma.knowledgeCategory.findMany()

    for (let i = 0; i < sampleDocuments.length; i++) {
      const doc = sampleDocuments[i]
      const category = categories.find(cat => cat.name.toLowerCase().includes(
        doc.title.toLowerCase().split(' ')[0]
      )) || categories.find(cat => cat.name === 'General')

      await prisma.knowledgeDocument.create({
        data: {
          ...doc,
          categoryId: category?.id || null,
          source: 'seed',
          viewCount: Math.floor(Math.random() * 100)
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Default categories and sample documents created successfully'
    })

  } catch (error) {
    console.error('Error seeding data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}