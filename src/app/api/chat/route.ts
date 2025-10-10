import { NextRequest, NextResponse } from 'next/server'

// Check if we should use Ollama or ZAI based on environment variables
const USE_OLLAMA = process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'

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

// Function to call ZAI API
async function callZAIAPI(message: string): Promise<string> {
  try {
    // Dynamic import to avoid issues if ZAI is not available
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const systemPrompt = `Anda adalah Attallah, asisten digital Yayasan Pendidikan Islam yang profesional, ramah, dan berpengetahuan luas. 
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

    const completion = await zai.chat.completions.create({
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
      max_tokens: 500
    })

    return completion.choices[0]?.message?.content || 'Maaf, saya tidak dapat merespons saat ini.'
  } catch (error) {
    console.error('ZAI API Error:', error)
    throw new Error('Failed to get response from ZAI')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    let response: string

    // Use Ollama if environment variables are set, otherwise use ZAI
    if (USE_OLLAMA) {
      console.log('Using Ollama API...')
      const messages: OllamaMessage[] = [
        {
          role: 'system',
          content: `Anda adalah Attallah, asisten digital Yayasan Pendidikan Islam yang profesional, ramah, dan berpengetahuan luas. 
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
        },
        {
          role: 'user',
          content: message
        }
      ]
      
      response = await callOllamaAPI(messages)
    } else {
      console.log('Using ZAI API...')
      response = await callZAIAPI(message)
    }

    return NextResponse.json({ response })

  } catch (error) {
    console.error('Chat API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        response: 'Maaf, terjadi kesalahan pada sistem. Silakan coba lagi nanti.'
      },
      { status: 500 }
    )
  }
}