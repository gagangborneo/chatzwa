import { NextRequest, NextResponse } from 'next/server'
import { getActivePersona } from '@/lib/persona-service'
import { chatStorage } from '@/lib/chat-storage'

// Check if we should use Ollama or OpenRouter based on environment variables
const USE_OLLAMA = process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'
const OPENROUTER_MODEL = process.env.DEFAULT_AI_MODEL || process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free'
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1'


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

// Generate dynamic system prompt based on active persona
function generateSystemPrompt(persona: any): string {
  if (!persona) {
    // Fallback to default persona
    return `Anda adalah Attallah, asisten digital Yayasan Pendidikan Islam yang profesional, ramah, dan berpengetahuan luas.
    Tugas Anda adalah membantu pengguna seputar:
    1. **Program Pendidikan**: Informasi tentang kurikulum, pendaftaran, jadwal, biaya, dan fasilitas pendidikan
    2. **Transaksi**: Bantuan terkait pembayaran, donasi, dan administrasi keuangan
    3. **Data**: Informasi tentang data siswa, alumni, dan statistik yayasan
    4. **Kajian**: Jadwal kajian Islam, materi, dan informasi pemateri
    5. **Program Donasi**: Informasi tentang program donasi, cara berdonasi, dan dampak donasi
    6. **Ilmu Al-Quran**: Bantuan terkait pembelajaran Al-Quran, tajwid, dan tafsir

    **Guidelines:**
    - Gunakan bahasa Indonesia yang formal namun hangat dan bersahabat
    - Mulai respons dengan salam Islami (Assalamualaikum) jika memungkinkan
    - Sertakan referensi Al-Quran atau Hadits jika relevan dengan topik
    - Berikan informasi yang akurat dan bermanfaat
    - Jika tidak tahu jawabannya, katakan dengan jujur dan tawarkan bantuan alternatif
    - Bersikap sabar, empatik, dan profesional

    Jawablah dengan singkat, jelas, dan langsung ke inti masalah.`
  }

  // Build persona-based system prompt
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

  const knowledgeDomainText =
    persona.knowledgeDomain === 'islamic_education' ? 'Pendidikan Islam dan studi agama' :
    persona.knowledgeDomain === 'education' ? 'Pendidikan umum dan akademis' :
    persona.knowledgeDomain === 'religious' ? 'Studi keagamaan' : 'Umum dan berbagai topik'

  const languageStyleText =
    persona.languageStyle === 'friendly' ? 'Ramah dan akrab' :
    persona.languageStyle === 'professional' ? 'Profesional dan terstruktur' :
    persona.languageStyle === 'academic' ? 'Akademis dan formal' : 'Kasual dan santai'

  const culturalContextText =
    persona.culturalContext === 'islamic' ? 'Islami dengan nilai-nilai Islam' :
    persona.culturalContext === 'indonesian' ? 'Indonesia dengan budaya lokal' :
    persona.culturalContext === 'western' ? 'Modern dan internasional' : 'Netral dan universal'

  const expertiseText =
    persona.expertise === 'general' ? 'Pengetahuan umum' :
    persona.expertise === 'intermediate' ? 'Menengah dengan pengalaman' :
    persona.expertise === 'expert' ? 'Ahli mendalam' : 'Sarjana akademis'

  const personalityText =
    persona.personality === 'helpful' ? 'Suka membantu dan suportif' :
    persona.personality === 'formal' ? 'Formal dan terstruktur' :
    persona.personality === 'friendly' ? 'Ramah dan hangat' :
    persona.personality === 'teacher' ? 'Gaya mengajar yang sabar' : 'Pemandu yang informatif'

  const humorText =
    persona.humor === 'high' ? 'suka humor ringan' :
    persona.humor === 'medium' ? 'humor sesekali' : 'serius dan fokus'

  const verbosityText =
    persona.verbosity === 'concise' ? 'singkat dan padat' :
    persona.verbosity === 'detailed' ? 'detail dan komprehensif' : 'seimbang'

  const systemPrompt = `Anda adalah ${persona.name}, asisten AI profesional yang berdedikasi untuk membantu pengguna.

**Kepribadian Anda:**
- Nama: ${persona.name}
- Gaya bahasa: ${formalityMap[persona.formality] || formalityMap.professional}
- Tingkat keantusiasan: ${enthusiasmMap[persona.enthusiasm] || enthusiasmMap.medium}
- Tingkat empati: ${empathyMap[persona.empathy] || empathyMap.medium}
- Selera humor: ${humorText}
- Verbositas: ${verbosityText}

**Domain Keahlian:**
- Pengetahuan: ${knowledgeDomainText}
- Gaya bahasa: ${languageStyleText}
- Konteks budaya: ${culturalContextText}
- Tingkat keahlian: ${expertiseText}
- Personalitas: ${personalityText}

**Pesan Pembuka:**
${persona.welcomeMessage}

**Pedoman Interaksi:**
- Gunakan nama "${persona.name}" saat memperkenalkan diri
- Sesuaikan gaya bahasa dengan kepribadian Anda di atas
- ${persona.useEmojis ? 'Gunakan emoji yang sesuai untuk membuat percakapan lebih hidup' : 'Hindari penggunaan emoji'}
- ${persona.includeGreeting ? 'Mulai respons dengan sapaan yang hangat' : 'Langsung ke inti pembicaraan'}
- ${persona.askFollowUp ? 'Akhiri respons dengan pertanyaan lanjutan jika relevan' : 'Berikan respons lengkap tanpa perlu pertanyaan lanjutan'}
- Batasi respons hingga ${persona.maxLength} kata
- Respon dalam waktu ${persona.minResponseTime}-${persona.maxResponseTime} detik untuk simulasi berpikir

${persona.systemPrompt ? `\n**Instruksi Khusus:**\n${persona.systemPrompt}` : ''}
${persona.customInstructions ? `\n**Instruksi Tambahan:**\n${persona.customInstructions}` : ''}

**Tugas Utama:**
Bantu pengguna seputar:
1. **Program Pendidikan**: Informasi kurikulum, pendaftaran, jadwal, biaya, dan fasilitas
2. **Transaksi**: Bantuan pembayaran, donasi, dan administrasi keuangan
3. **Data**: Informasi data siswa, alumni, dan statistik yayasan
4. **Kajian**: Jadwal kajian Islam, materi, dan informasi pemateri
5. **Program Donasi**: Informasi program donasi, cara berdonasi, dan dampaknya
6. **Ilmu Al-Quran**: Bantuan pembelajaran Al-Quran, tajwid, dan tafsir

**Prinsip Dasar:**
- Berikan informasi yang akurat dan bermanfaat
- Jika tidak tahu jawabannya, katakan dengan jujur
- Bersikap sabar, empatik, dan profesional
- ${persona.culturalContext === 'islamic' ? 'Sertakan referensi Al-Quran atau Hadits jika relevan' : 'Berikan informasi yang terpercaya dan dapat diverifikasi'}

Jawablah sesuai kepribadian Anda di atas!`

  return systemPrompt
}

// Function to call OpenRouter API
async function callOpenRouterAPI(message: string, persona: any): Promise<string> {
  try {
    const systemPrompt = generateSystemPrompt(persona)

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
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'AI Chatbot'
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

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let sessionId: string | null = null

  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get or create session ID
    sessionId = chatStorage.getSessionId(request)

    // Get active persona
    const activePersona = await getActivePersona()

    if (!activePersona) {
      console.warn('No active persona found, using default settings')
    }

    let response: string

    // Use Ollama if environment variables are set, otherwise use OpenRouter
    if (USE_OLLAMA) {
      console.log('Using Ollama API with persona:', activePersona?.name || 'Default')
      const systemPrompt = generateSystemPrompt(activePersona)

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
      console.log('Using OpenRouter API with persona:', activePersona?.name || 'Default')
      response = await callOpenRouterAPI(message, activePersona)
    } else {
      console.error('No AI service configured. Please set OLLAMA_BASE_URL & OLLAMA_MODEL for Ollama or OPENROUTER_API_KEY for OpenRouter.')
      throw new Error('No AI service configured')
    }

    // Simulate response time based on persona settings
    if (activePersona && (activePersona.minResponseTime || activePersona.maxResponseTime)) {
      const minTime = activePersona.minResponseTime || 1.0
      const maxTime = activePersona.maxResponseTime || 5.0
      const responseTime = Math.random() * (maxTime - minTime) + minTime

      // Add artificial delay to simulate response time
      await new Promise(resolve => setTimeout(resolve, responseTime * 1000))
    }

    // Save conversation to both local storage and database (non-blocking)
    if (sessionId && response) {
      // Don't wait for storage to complete for better user experience
      chatStorage.saveMessage(
        sessionId,
        message,
        response,
        activePersona?.id,
        undefined, // userId (can be added later when auth is implemented)
        request
      ).catch(error => {
        console.error('Failed to save conversation:', error)
      })
    }

    return NextResponse.json({
      response,
      persona: {
        name: activePersona?.name || 'Default Assistant',
        profile: activePersona?.selectedProfile || 'default'
      },
      sessionId, // Return session ID for client-side tracking
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('Chat API Error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        response: 'Maaf, terjadi kesalahan pada sistem. Silakan coba lagi nanti.',
        sessionId
      },
      { status: 500 }
    )
  }
}