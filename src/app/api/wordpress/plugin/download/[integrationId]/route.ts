import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unifiedAuth } from '@/lib/auth'
import { cookies } from 'next/headers'
import { WordPressPluginGenerator } from '@/lib/wordpress/plugin-generator'

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
          message: 'Please login to download WordPress plugin',
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
        chatbot: true,
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

    // Create plugin configuration
    const config = {
      pluginName: wordpressIntegration.name,
      pluginDescription: `Advanced chatbot plugin for ${wordpressIntegration.chatbot.name}`,
      pluginAuthor: user.name || 'Chatbot User',
      pluginAuthorUrl: 'https://chatbot.example.com',
      pluginVersion: '1.0.0',
      chatbotApiUrl: wordpressIntegration.settings?.config?.chatbotApiUrl || `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/chat`,
      apiKey: wordpressIntegration.chatbot.apiKey || 'demo-api-key',
      theme: wordpressIntegration.settings?.theme || {
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        textColor: '#ffffff',
        backgroundColor: '#ffffff',
        buttonColor: '#10b981',
      },
      settings: wordpressIntegration.settings?.config || {
        position: 'bottom-right',
        showOnMobile: true,
        autoOpen: false,
        welcomeMessage: 'Hello! How can I help you today?',
        placeholder: 'Type your message...',
      },
    }

    // Generate plugin files
    const generator = new WordPressPluginGenerator(config)
    const pluginHTML = generator.generatePluginHTML(config, generator.generatePluginFiles())

    // Create downloadable blob
    const blob = WordPressPluginGenerator.createDownloadablePlugin(config)

    // Return the plugin as downloadable HTML file
    return new NextResponse(pluginHTML, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${wordpressIntegration.name.toLowerCase().replace(/\s+/g, '-')}-plugin.html"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error downloading WordPress plugin:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to download WordPress plugin',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}