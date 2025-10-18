import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { unifiedAuth } from '@/lib/auth'
import { cookies } from 'next/headers'
import { WordPressPluginGenerator } from '@/lib/wordpress/plugin-generator'
import { WordPressPluginConfig } from '@/lib/wordpress/plugin-generator'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Please login to generate WordPress plugin',
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

    const body = await request.json()
    const {
      pluginName,
      chatbotId,
      theme,
      settings,
    } = body

    // Validate required fields
    if (!pluginName || !chatbotId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Plugin name and chatbot ID are required',
        },
        { status: 400 }
      )
    }

    // Check if user owns the chatbot
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: chatbotId,
        userId: user.id,
      },
    })

    if (!chatbot) {
      return NextResponse.json(
        {
          success: false,
          error: 'Chatbot not found',
          message: 'The specified chatbot does not exist or you do not have permission to access it',
        },
        { status: 404 }
      )
    }

    // Create WordPress plugin configuration
    const config: WordPressPluginConfig = {
      pluginName,
      pluginDescription: `Advanced chatbot plugin for ${chatbot.name}`,
      pluginAuthor: user.name || 'Chatbot User',
      pluginAuthorUrl: 'https://chatbot.example.com',
      pluginVersion: '1.0.0',
      chatbotApiUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/chat`,
      apiKey: chatbot.apiKey || 'demo-api-key',
      theme: {
        primaryColor: theme?.primaryColor || '#10b981',
        secondaryColor: theme?.secondaryColor || '#059669',
        textColor: theme?.textColor || '#ffffff',
        backgroundColor: theme?.backgroundColor || '#ffffff',
        buttonColor: theme?.buttonColor || '#10b981',
      },
      settings: {
        position: settings?.position || 'bottom-right',
        showOnMobile: settings?.showOnMobile ?? true,
        autoOpen: settings?.autoOpen ?? false,
        welcomeMessage: settings?.welcomeMessage || 'Hello! How can I help you today?',
        placeholder: settings?.placeholder || 'Type your message...',
      },
    }

    // Generate plugin files
    const generator = new WordPressPluginGenerator(config)
    const pluginFiles = generator.generatePluginFiles()

    // Create WordPress integration record
    const wordpressIntegration = await prisma.wordpressIntegration.create({
      data: {
        userId: user.id,
        chatbotId: chatbotId,
        name: pluginName,
        url: null, // Will be set when user installs plugin
        status: 'active',
        settings: {
          theme: config.theme,
          config: config.settings,
          apiEndpoint: config.chatbotApiUrl,
          pluginConfig: config,
        },
        lastSyncAt: new Date(),
      },
    })

    // Create download URL (temporary)
    const downloadBlob = WordPressPluginGenerator.createDownloadablePlugin(config)
    const downloadId = `wp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In a real implementation, you would store this blob temporarily
    // For now, we'll return the HTML content directly
    const pluginHTML = generator.generatePluginHTML(config, pluginFiles)

    return NextResponse.json({
      success: true,
      data: {
        integration: wordpressIntegration,
        pluginConfig: config,
        pluginFiles: pluginFiles,
        downloadUrl: `/api/wordpress/plugin/download/${wordpressIntegration.id}`,
        installationInstructions: {
          method1: 'Upload the plugin ZIP file to your WordPress admin dashboard',
          method2: 'Extract the files and upload to wp-content/plugins/',
          configuration: {
            apiUrl: config.chatbotApiUrl,
            apiKey: config.apiKey,
            adminUrl: 'wp-admin/options-general.php?page=chatbot-settings',
          },
        },
      },
      message: 'WordPress plugin generated successfully',
    })
  } catch (error) {
    console.error('Error generating WordPress plugin:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate WordPress plugin',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}