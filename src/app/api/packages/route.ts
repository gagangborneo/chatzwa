import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const billingCycle = searchParams.get('billingCycle')
    const active = searchParams.get('active')

    let whereClause: any = {
      isActive: active !== 'false',
    }

    if (billingCycle) {
      whereClause.billingCycle = billingCycle
    }

    const packages = await prisma.package.findMany({
      where: whereClause,
      orderBy: [
        { sortOrder: 'asc' },
        { price: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        displayName: true,
        description: true,
        price: true,
        billingCycle: true,
        currency: true,
        sortOrder: true,
        isActive: true,
        isPopular: true,
        maxChatbots: true,
        maxMessages: true,
        maxKnowledgeDocs: true,
        maxTeamMembers: true,
        maxApiCalls: true,
        features: true,
        apiAccess: true,
        whatsappIntegration: true,
        customDomain: true,
        prioritySupport: true,
        advancedAnalytics: true,
        customBranding: true,
        exportData: true,
        ragSystem: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        packages,
        count: packages.length,
      },
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      displayName,
      description,
      price,
      billingCycle,
      maxChatbots,
      maxMessages,
      maxKnowledgeDocs,
      maxTeamMembers,
      maxApiCalls,
      features,
      isPopular,
      sortOrder,
    } = body

    // Validate required fields
    if (!name || !displayName || !description || price === undefined || !billingCycle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name, displayName, description, price, and billingCycle are required',
        },
        { status: 400 }
      )
    }

    // Check if package with this name already exists
    const existingPackage = await prisma.package.findUnique({
      where: { name },
    })

    if (existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package already exists',
          message: `Package with name '${name}' already exists`,
        },
        { status: 409 }
      )
    }

    const newPackage = await prisma.package.create({
      data: {
        name,
        displayName,
        description,
        price,
        billingCycle,
        maxChatbots: maxChatbots || 1,
        maxMessages,
        maxKnowledgeDocs,
        maxTeamMembers: maxTeamMembers || 1,
        maxApiCalls,
        features: features || {},
        isPopular: isPopular || false,
        sortOrder: sortOrder || 0,
        currency: 'IDR',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        package: newPackage,
      },
      message: 'Package created successfully',
    })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create package',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}