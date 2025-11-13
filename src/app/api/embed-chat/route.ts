import { NextRequest, NextResponse } from 'next/server'
import { getActivePersona } from '@/lib/persona-service'
import { chatStorage } from '@/lib/chat-storage'

interface EmbedChatRequest {
  message: string
  sessionId: string
  widgetId: string
  url: string
  userAgent: string
  userId?: string
}

interface EmbedChatResponse {
  message: string
  sessionId: string
  timestamp: number
  persona?: {
    name: string
    profile: string
  }
  processingTime?: number
}

// AI Configuration
const USE_OLLAMA = process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'
const OPENROUTER_MODEL = process.env.DEFAULT_AI_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free'
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'

// AI API Interfaces
interface OllamaMessage {
  role: string
  content: string
}

interface OllamaRequest {
  model: string
  messages: OllamaMessage[]
  stream: boolean
}

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
}

interface OpenRouterMessage {
  role: string
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

interface OpenRouterChoice {
  message: {
    role: string
    content: string
  }
  finish_reason: string
}

interface OpenRouterResponse {
  id: string
  object: string
  created: number
  model: string
  choices: OpenRouterChoice[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// In a real implementation, these would come from your database
const WIDGET_CONFIGS = new Map([
  ['widget_123', {
    apiKey: 'api_key_123',
    name: 'Customer Support',
    welcomeMessage: 'Halo! Selamat datang di layanan customer support kami.',
    businessName: 'Example Company'
  }],
  ['widget_456', {
    apiKey: 'api_key_456',
    name: 'Sales Assistant',
    welcomeMessage: 'Hi! I\'m here to help you with your purchase.',
    businessName: 'E-commerce Store'
  }]
])

// Default widget configuration for any widget ID
const DEFAULT_WIDGET_CONFIG = {
  apiKey: 'default_api_key',
  name: 'Customer Support',
  welcomeMessage: 'Halo! Selamat datang di layanan customer support kami.',
  businessName: 'Chatzwa'
}

// Get widget configuration or return default
function getWidgetConfig(widgetId: string) {
  return WIDGET_CONFIGS.get(widgetId) || DEFAULT_WIDGET_CONFIG
}

// Validate user and get user context (in real implementation, this would query database)
async function validateAndGetUser(userId?: string): Promise<{ id?: string, name?: string, preferences?: any } | null> {
  if (!userId) {
    return null
  }

  // In a real implementation, you would validate the user ID against your database
  // For now, we'll simulate user validation with some demo users
  const demoUsers = {
    'user_test_123': {
      id: 'user_test_123',
      name: 'Test User',
      preferences: {
        language: 'id',
        theme: 'light',
        notifications: true
      }
    },
    'admin@admin.com': {
      id: 'admin@admin.com',
      name: 'Administrator',
      preferences: {
        language: 'id',
        theme: 'dark',
        notifications: false
      }
    }
  }

  const user = demoUsers[userId as keyof typeof demoUsers]
  if (user) {
    console.log('✅ User validated:', { id: user.id, name: user.name })
    return user
  }

  // For unknown user IDs, we can either:
  // 1. Return null (reject the request)
  // 2. Return a generic user profile (allow with limited access)
  console.log('⚠️ Unknown user ID, treating as anonymous:', userId)
  return {
    id: userId,
    name: 'Guest User',
    preferences: {
      language: 'id',
      theme: 'light',
      notifications: true
    }
  }
}

// Get user-specific persona or fallback to default
async function getUserPersona(userId?: string, activePersona?: any): Promise<any> {
  if (!userId) {
    return activePersona
  }

  // In a real implementation, you would check if the user has a custom persona
  // For now, we'll use the active persona for all users
  return activePersona
}

// Function to call Ollama API
async function callOllamaAPI(messages: OllamaMessage[]): Promise<string> {
  const ollamaRequest: OllamaRequest = {
    model: OLLAMA_MODEL,
    messages: messages,
    stream: false
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaRequest),
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
    }

    const data: OllamaResponse = await response.json()
    return data.response
  } catch (error) {
    console.error('Ollama API Error:', error)
    throw new Error('Failed to get response from Ollama')
  }
}

// Generate dynamic system prompt based on active persona and user context
function generateSystemPrompt(persona: any, widgetConfig: any, user?: any): string {
  if (!persona) {
    // Fallback to default persona with widget context and user personalization
    const userContext = user ? `

**User Context:**
- Nama: ${user.name || 'Pengguna'}
- User ID: ${user.id}
- Preferensi: ${JSON.stringify(user.preferences || {}, null, 2)}
${user.id !== 'anonymous' ? '- Ini adalah user terdaftar, berikan layanan yang lebih personalized' : '- Ini adalah user tamu, berikan layanan standar'}` : ''

    return `Anda adalah asisten AI dari ${widgetConfig.businessName || 'Chatzwa'} yang profesional, ramah, dan berpengetahuan luas.${userContext}

    Tugas Anda adalah membantu pengguna seputar:
    1. **AI Chatbot**: Layanan customer service 24/7 dengan AI
    2. **WhatsApp Business API**: Integrasi WhatsApp untuk bisnis
    3. **WordPress Plugin**: Plugin chat untuk website WordPress
    4. **Embed Chat**: Widget chat yang dapat disematkan di website
    5. **Layanan Teknis**: Bantuan instalasi dan konfigurasi
    6. **Informasi Harga**: Detail paket dan biaya layanan

    **Guidelines:**
    - Gunakan bahasa Indonesia yang profesional namun hangat
    - Berikan informasi yang akurat tentang ${widgetConfig.businessName || 'Chatzwa'}
    - Jika tidak tahu jawabannya, katakan dengan jujur dan tawarkan bantuan alternatif
    - Bersikap sabar, empatik, dan profesional
    - Sertakan informasi kontak jika diperlukan
    ${user?.name ? `- Sapa user dengan nama "${user.name}" untuk personalisasi` : '- Berikan sapaan yang umum dan ramah'}
    ${user?.preferences?.language === 'en' ? '- Jika user meminta, bisa respons dalam bahasa Inggris' : '- Gunakan bahasa Indonesia sebagai bahasa utama'}

    Jawablah dengan singkat, jelas, dan langsung ke inti masalah.`
  }

  // Add user context to persona-based system prompt
  const userContext = user ? `

**User Context:**
- Nama: ${user.name || 'Pengguna'}
- User ID: ${user.id}
- Preferensi: ${JSON.stringify(user.preferences || {}, null, 2)}
${user.id !== 'anonymous' ? '- Ini adalah user terdaftar, berikan layanan yang lebih personalized' : '- Ini adalah user tamu, berikan layanan standar'}` : ''

  // Build persona-based system prompt with widget context
  const formalityMap = {
    casual: 'santai dan informal',
    professional: 'profesional namun ramah',
    formal: 'sangat formal dan akademis'
  }

  const enthusiasmMap = {
    low: 'tenang dan bijaksana',
    medium: 'antusias dan bersemangat',
    high: 'sangat bersemangat dan energik'
  }

  const empathyMap = {
    low: 'fokus pada fakta dan solusi',
    medium: 'perhatian dan empatik',
    high: 'sangat empatik dan peduli'
  }

  const systemPrompt = `Anda adalah ${persona.name}, asisten AI profesional dari ${widgetConfig.businessName || 'Chatzwa'} yang berdedikasi untuk membantu pengguna.${userContext}

**Kepribadian Anda:**
- Nama: ${persona.name}
- Gaya bahasa: ${formalityMap[persona.formality] || formalityMap.professional}
- Tingkat keantusiasan: ${enthusiasmMap[persona.enthusiasm] || enthusiasmMap.medium}
- Tingkat empati: ${empathyMap[persona.empathy] || empathyMap.medium}

**Pesan Pembuka:**
${persona.welcomeMessage}

**Pedoman Interaksi:**
- Gunakan nama "${persona.name}" saat memperkenalkan diri
- Sesuaikan gaya bahasa dengan kepribadian Anda di atas
- ${persona.useEmojis ? 'Gunakan emoji yang sesuai untuk membuat percakapan lebih hidup' : 'Hindari penggunaan emoji'}
- ${persona.includeGreeting ? 'Mulai respons dengan sapaan yang hangat' : 'Langsung ke inti pembicaraan'}
- ${persona.askFollowUp ? 'Akhiri respons dengan pertanyaan lanjutan jika relevan' : 'Berikan respons lengkap tanpa perlu pertanyaan lanjutan'}
- Batasi respons hingga ${persona.maxLength} kata
- ${user?.name ? `Sapa user dengan nama "${user.name}" untuk personalisasi` : 'Berikan sapaan yang umum dan ramah'}
- ${user?.id !== 'anonymous' ? 'Ini adalah user terdaftar, berikan layanan yang lebih personalized dan perhatian khusus' : 'Ini adalah user tamu, berikan layanan standar yang ramah'}

**Tugas Utama:**
Bantu pengguna seputar layanan ${widgetConfig.businessName || 'Chatzwa'}:
1. **AI Chatbot**: Layanan customer service 24/7 dengan AI
2. **WhatsApp Business API**: Integrasi WhatsApp untuk bisnis
3. **WordPress Plugin**: Plugin chat untuk website WordPress
4. **Embed Chat**: Widget chat yang dapat disematkan di website
5. **Layanan Teknis**: Bantuan instalasi dan konfigurasi
6. **Informasi Harga**: Detail paket dan biaya layanan

**Prinsip Dasar:**
- Berikan informasi yang akurat dan bermanfaat
- Jika tidak tahu jawabannya, katakan dengan jujur
- Bersikap sabar, empatik, dan profesional
- Berikan informasi kontak ${widgetConfig.businessName || 'Chatzwa'} jika diperlukan

Jawablah sesuai kepribadian Anda di atas!`

  return systemPrompt
}

// Function to call OpenRouter API
async function callOpenRouterAPI(message: string, persona: any, widgetConfig: any, user?: any): Promise<string> {
  try {
    const systemPrompt = generateSystemPrompt(persona, widgetConfig, user)

    const openRouterRequest: OpenRouterRequest = {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: persona?.maxLength || 500,
      stream: false
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'Chatzwa AI Chatbot'
      },
      body: JSON.stringify(openRouterRequest)
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const data: OpenRouterResponse = await response.json()
    return data.choices[0]?.message?.content || 'Maaf, saya tidak dapat merespons saat ini.'
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    throw new Error('Failed to get response from OpenRouter')
  }
}

// Main AI response function
async function generateAIResponse(message: string, widgetConfig: any, persona: any, user?: any): Promise<string> {
  try {
    let response: string

    // Use Ollama if environment variables are set, otherwise use OpenRouter
    if (USE_OLLAMA) {
      console.log('Embed Chat: Using Ollama API with persona:', persona?.name || 'Default')
      const systemPrompt = generateSystemPrompt(persona, widgetConfig, user)

      const messages: OllamaMessage[] = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ]

      response = await callOllamaAPI(messages)
    } else if (OPENROUTER_API_KEY) {
      console.log('Embed Chat: Using OpenRouter API with persona:', persona?.name || 'Default')
      response = await callOpenRouterAPI(message, persona, widgetConfig, user)
    } else {
      console.error('Embed Chat: No AI service configured. Please set OLLAMA_BASE_URL & OLLAMA_MODEL for Ollama or OPENROUTER_API_KEY for OpenRouter.')
      // Fallback to simple response
      return `Terima kasih atas pesan Anda. Saya dari ${widgetConfig.businessName || 'Chatzwa'} siap membantu Anda dengan informasi tentang layanan kami. Mohon maaf, layanan AI sedang dalam konfigurasi. Silakan hubungi tim support kami untuk bantuan lebih lanjut.`
    }

    // Simulate response time based on persona settings
    if (persona && (persona.minResponseTime || persona.maxResponseTime)) {
      const minTime = persona.minResponseTime || 1.0
      const maxTime = persona.maxResponseTime || 5.0
      const responseTime = Math.random() * (maxTime - minTime) + minTime

      // Add artificial delay to simulate response time
      await new Promise(resolve => setTimeout(resolve, responseTime * 1000))
    }

    return response
  } catch (error) {
    console.error('Embed Chat: AI Error:', error)
    return `Maaf, terjadi kesalahan pada sistem AI. Silakan coba lagi nanti atau hubungi tim support ${widgetConfig.businessName || 'Chatzwa'}.`
  }
}

// Log chat message for analytics
async function logChatMessage(data: EmbedChatRequest, response: string) {
  // In a real implementation, you would save this to your database
  console.log('Chat message logged:', {
    timestamp: new Date().toISOString(),
    sessionId: data.sessionId,
    widgetId: data.widgetId,
    url: data.url,
    userAgent: data.userAgent,
    message: data.message,
    response: response
  })

  // Example database save:
  // await db.chatLog.create({
  //   sessionId: data.sessionId,
  //   widgetId: data.widgetId,
  //   message: data.message,
  //   response: response,
  //   url: data.url,
  //   userAgent: data.userAgent,
  //   timestamp: new Date()
  // })
}

export async function POST(request: NextRequest) {
  console.log('🔄 Embed Chat API: Request received')
  const startTime = Date.now()

  // Add CORS headers for cross-origin requests
  const origin = request.headers.get('origin')
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  try {
    const body: EmbedChatRequest = await request.json()
    const { message, sessionId, widgetId, url, userAgent, userId } = body

    console.log('📥 Embed Chat Request:', {
      message: message?.substring(0, 50) + (message?.length > 50 ? '...' : ''),
      sessionId,
      widgetId,
      userId: userId || 'anonymous',
      url: url?.substring(0, 100) + (url?.length > 100 ? '...' : ''),
      userAgent: userAgent?.substring(0, 100) + (userAgent?.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString()
    })

    // Validate required fields
    if (!message || !sessionId || !widgetId) {
      console.error('❌ Validation Error: Missing required fields:', {
        message: !!message,
        sessionId: !!sessionId,
        widgetId: !!widgetId
      })
      return NextResponse.json(
        {
          error: 'Missing required fields: message, sessionId, widgetId',
          message: 'Permintaan tidak lengkap. Pastikan semua field terisi.'
        },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // Validate message length
    if (message.trim().length === 0) {
      console.error('❌ Validation Error: Empty message')
      return NextResponse.json(
        {
          error: 'Message cannot be empty',
          message: 'Pesan tidak boleh kosong.'
        },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    if (message.length > 1000) {
      console.error('❌ Validation Error: Message too long:', message.length)
      return NextResponse.json(
        {
          error: 'Message too long',
          message: 'Pesan terlalu panjang. Maksimal 1000 karakter.'
        },
        {
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // Get widget configuration (with fallback to default)
    const widgetConfig = getWidgetConfig(widgetId)
    console.log('⚙️ Widget Config:', {
      widgetId,
      configName: widgetConfig.name,
      businessName: widgetConfig.businessName,
      userId: userId || 'anonymous'
    })

    // Validate user and get user context
    console.log('👤 Validating user...')
    const user = await validateAndGetUser(userId)

    // Get active persona for AI responses
    console.log('🎭 Getting active persona...')
    const activePersona = await getActivePersona()

    if (!activePersona) {
      console.warn('⚠️ No active persona found, using default settings')
    }

    // Get user-specific persona (if any)
    const userPersona = await getUserPersona(userId, activePersona)

    // Generate AI response with user context
    console.log('🤖 Generating AI response...')
    const aiResponse = await generateAIResponse(message, widgetConfig, userPersona, user)
    const processingTime = Date.now() - startTime

    console.log('✅ AI Response Generated:', {
      responseLength: aiResponse.length,
      processingTime: `${processingTime}ms`,
      persona: activePersona?.name || 'Default',
      preview: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : '')
    })

    // Save conversation to both local storage and database (non-blocking)
    if (sessionId && aiResponse) {
      // Don't wait for storage to complete for better user experience
      chatStorage.saveMessage(
        sessionId,
        message,
        aiResponse,
        activePersona?.id,
        userId, // Pass user ID for personalization
        request
      ).catch(error => {
        console.error('Failed to save embed chat conversation:', error)
      })
    }

    // Log the interaction for analytics
    await logChatMessage(body, aiResponse)

    // Return response
    const response: EmbedChatResponse = {
      message: aiResponse,
      sessionId: sessionId,
      timestamp: Date.now(),
      persona: {
        name: activePersona?.name || 'Default Assistant',
        profile: activePersona?.selectedProfile || 'default'
      },
      processingTime: processingTime
    }

    console.log('📤 Embed Chat Response Sent:', {
      sessionId,
      userId: userId || 'anonymous',
      responseLength: aiResponse.length,
      persona: activePersona?.name || 'Default',
      processingTime: `${processingTime}ms`,
      timestamp: response.timestamp
    })

    return NextResponse.json(response, {
      headers: corsHeaders
    })

  } catch (error) {
    console.error('💥 Embed Chat API Error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : 'No stack trace',
      timestamp: new Date().toISOString()
    })

    // Determine appropriate error response
    let errorMessage = 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('AbortError')) {
        errorMessage = 'Maaf, permintaan terlalu lama. Silakan coba lagi.'
        statusCode = 408
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Maaf, format permintaan tidak valid.'
        statusCode = 400
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
        timestamp: Date.now(),
        details: process.env.NODE_ENV === 'development' ?
          (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      {
        status: statusCode,
        headers: corsHeaders
      }
    )
  }
}

export async function GET(request: NextRequest) {
  // Add CORS headers for cross-origin requests
  const origin = request.headers.get('origin')
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  return NextResponse.json({
    message: 'Chatzwa Embed Chat API',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/embed-chat',
      health: 'GET /api/embed-chat'
    }
  }, {
    headers: corsHeaders
  })
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  })
}