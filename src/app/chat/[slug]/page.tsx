'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bot, ArrowLeft, Home, Settings } from 'lucide-react'
import Link from 'next/link'
import ChatInterface from '@/components/chat-interface'

interface Persona {
  id: string
  slug: string
  name: string
  welcomeMessage: string
  selectedProfile: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      loadPersonaBySlug(slug)
    }
  }, [slug])

  const loadPersonaBySlug = async (slug: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/persona?slug=${slug}`)
      const data = await response.json()

      if (data.success && data.data) {
        setPersona(data.data)
      } else {
        setError(`Persona dengan slug "${slug}" tidak ditemukan`)
      }
    } catch (err) {
      console.error('Error loading persona:', err)
      setError('Gagal memuat persona. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat persona...</p>
        </div>
      </div>
    )
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Bot className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-800">Persona Tidak Ditemukan</CardTitle>
            <CardDescription>
              {error || `Persona dengan slug "${slug}" tidak ditemukan`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Pastikan URL yang Anda masukkan benar, atau hubungi pemilik persona ini.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>

              <Link href="/" className="flex-1">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
              </Link>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{persona.name}</h1>
                  <p className="text-sm text-gray-500">
                    {persona.selectedProfile === 'islamic_educator' ? 'Pendidik Islam' :
                     persona.selectedProfile === 'customer_service' ? 'Layanan Pelanggan' :
                     persona.selectedProfile === 'academic_assistant' ? 'Asisten Akademik' :
                     persona.selectedProfile === 'friendly_guide' ? 'Pemandu Ramah' :
                     persona.selectedProfile === 'professional_advisor' ? 'Penasihat Profesional' : 'Assistant'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right mr-4">
                <p className="text-sm text-gray-500">Dibuat oleh:</p>
                <p className="text-sm font-medium text-gray-900">{persona.user.name}</p>
              </div>

              <Link href="/dashboard/persona">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Kelola Persona
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInterface personaOverride={persona} />
        </div>
      </div>
    </div>
  )
}