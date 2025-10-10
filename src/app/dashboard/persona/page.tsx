'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bot,
  MessageSquare,
  Palette,
  Eye,
  Save,
  RotateCcw,
  Sparkles,
  Heart,
  Volume2,
  Languages,
  Clock,
  User,
  Brain,
  Settings
} from 'lucide-react'

export default function PersonaPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('identity')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // State for persona settings
  const [aiName, setAiName] = useState('Attallah Assistant')
  const [welcomeMessage, setWelcomeMessage] = useState('Assalamualaikum! Saya adalah Attallah, asisten digital Yayasan Pendidikan Islam. Saya siap membantu Anda seputar informasi program pendidikan, transaksi, data, kajian, program donasi, dan ilmu Al-Quran. Ada yang bisa saya bantu? 🌟')

  const [selectedProfile, setSelectedProfile] = useState('islamic_educator')

  const [textStyle, setTextStyle] = useState({
    formality: 'professional',
    empathy: 'high',
    enthusiasm: 'medium',
    humor: 'low',
    verbosity: 'medium'
  })

  const [behaviorSettings, setBehaviorSettings] = useState({
    knowledgeDomain: 'islamic_education',
    languageStyle: 'friendly',
    culturalContext: 'indonesian',
    expertise: 'general',
    personality: 'helpful'
  })

  const [responseSettings, setResponseSettings] = useState({
    maxLength: 500,
    minResponseTime: 1.0,
    maxResponseTime: 5.0,
    useEmojis: true,
    includeGreeting: true,
    askFollowUp: true
  })

  const [systemPrompt, setSystemPrompt] = useState('Anda adalah asisten AI profesional untuk Yayasan Pendidikan Islam. Selalu berikan jawaban yang sopan, informatif, dan sesuai dengan nilai-nilai Islam. Gunakan bahasa Indonesia yang baik dan benar. Berikan informasi yang akurat tentang program pendidikan, kegiatan yayasan, dan layanan lainnya.')
  const [customInstructions, setCustomInstructions] = useState('')

  // Load active persona on component mount
  useEffect(() => {
    loadActivePersona()
  }, [])

  // Load active persona from database
  const loadActivePersona = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/persona?active=true')
      const data = await response.json()

      if (data.success && data.data) {
        const persona = data.data
        loadPersonaIntoState(persona)
        setCurrentPersonaId(persona.id)
      } else {
        // No active persona found, use defaults
        console.log('No active persona found, using defaults')
      }
    } catch (err) {
      console.error('Error loading persona:', err)
      setError('Gagal memuat persona. Menggunakan pengaturan default.')
    } finally {
      setLoading(false)
    }
  }

  // Load persona data into component state
  const loadPersonaIntoState = (persona: any) => {
    setAiName(persona.name || 'Attallah Assistant')
    setWelcomeMessage(persona.welcomeMessage || 'Assalamualaikum! Saya adalah Attallah...')
    setSelectedProfile(persona.selectedProfile || 'islamic_educator')

    setTextStyle({
      formality: persona.formality || 'professional',
      empathy: persona.empathy || 'high',
      enthusiasm: persona.enthusiasm || 'medium',
      humor: persona.humor || 'low',
      verbosity: persona.verbosity || 'medium'
    })

    setBehaviorSettings({
      knowledgeDomain: persona.knowledgeDomain || 'islamic_education',
      languageStyle: persona.languageStyle || 'friendly',
      culturalContext: persona.culturalContext || 'indonesian',
      expertise: persona.expertise || 'general',
      personality: persona.personality || 'helpful'
    })

    setResponseSettings({
      maxLength: persona.maxLength || 500,
      minResponseTime: persona.minResponseTime || 1.0,
      maxResponseTime: persona.maxResponseTime || 5.0,
      useEmojis: persona.useEmojis ?? true,
      includeGreeting: persona.includeGreeting ?? true,
      askFollowUp: persona.askFollowUp ?? true
    })

    setSystemPrompt(persona.systemPrompt || '')
    setCustomInstructions(persona.customInstructions || '')
  }

  // Save persona to database
  const savePersonaToDatabase = async () => {
    try {
      setSaving(true)
      setError(null)

      const personaData = {
        name: aiName,
        welcomeMessage: welcomeMessage,
        selectedProfile: selectedProfile,
        formality: textStyle.formality,
        empathy: textStyle.empathy,
        enthusiasm: textStyle.enthusiasm,
        humor: textStyle.humor,
        verbosity: textStyle.verbosity,
        knowledgeDomain: behaviorSettings.knowledgeDomain,
        languageStyle: behaviorSettings.languageStyle,
        culturalContext: behaviorSettings.culturalContext,
        expertise: behaviorSettings.expertise,
        personality: behaviorSettings.personality,
        maxLength: responseSettings.maxLength,
        minResponseTime: responseSettings.minResponseTime,
        maxResponseTime: responseSettings.maxResponseTime,
        useEmojis: responseSettings.useEmojis,
        includeGreeting: responseSettings.includeGreeting,
        askFollowUp: responseSettings.askFollowUp,
        systemPrompt: systemPrompt,
        customInstructions: customInstructions,
        isActive: true
      }

      const url = currentPersonaId ? `/api/persona/${currentPersonaId}` : '/api/persona'
      const method = currentPersonaId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personaData),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentPersonaId(data.data.id)
        setSaved(true)
        setHasChanges(false)
        setTimeout(() => setSaved(false), 3000)

        // If this is a new persona, activate it
        if (!currentPersonaId) {
          await activatePersona(data.data.id)
        }
      } else {
        throw new Error(data.error || 'Failed to save persona')
      }
    } catch (err) {
      console.error('Error saving persona:', err)
      setError(err instanceof Error ? err.message : 'Gagal menyimpan persona')
    } finally {
      setSaving(false)
    }
  }

  // Activate persona
  const activatePersona = async (personaId: string) => {
    try {
      const response = await fetch(`/api/persona/${personaId}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to activate persona')
      }
    } catch (err) {
      console.error('Error activating persona:', err)
    }
  }

  // Track changes
  const trackChanges = () => {
    setHasChanges(true)
    setSaved(false)
  }

  const saveSettings = async () => {
    await savePersonaToDatabase()
  }

  const resetSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      // Reset to defaults
      setAiName('Attallah Assistant')
      setWelcomeMessage('Assalamualaikum! Saya adalah Attallah, asisten digital Yayasan Pendidikan Islam. Saya siap membantu Anda seputar informasi program pendidikan, transaksi, data, kajian, program donasi, dan ilmu Al-Quran. Ada yang bisa saya bantu? 🌟')
      setSelectedProfile('islamic_educator')
      setTextStyle({
        formality: 'professional',
        empathy: 'high',
        enthusiasm: 'medium',
        humor: 'low',
        verbosity: 'medium'
      })
      setBehaviorSettings({
        knowledgeDomain: 'islamic_education',
        languageStyle: 'friendly',
        culturalContext: 'indonesian',
        expertise: 'general',
        personality: 'helpful'
      })
      setResponseSettings({
        maxLength: 500,
        minResponseTime: 1.0,
        maxResponseTime: 5.0,
        useEmojis: true,
        includeGreeting: true,
        askFollowUp: true
      })
      setSystemPrompt('Anda adalah asisten AI profesional untuk Yayasan Pendidikan Islam. Selalu berikan jawaban yang sopan, informatif, dan sesuai dengan nilai-nilai Islam. Gunakan bahasa Indonesia yang baik dan benar. Berikan informasi yang akurat tentang program pendidikan, kegiatan yayasan, dan layanan lainnya.')
      setCustomInstructions('')
      setCurrentPersonaId(null)
      setHasChanges(false)

      // If we had a persona loaded, reload it to undo changes
      if (currentPersonaId) {
        await loadActivePersona()
      }
    } catch (err) {
      console.error('Error resetting settings:', err)
      setError('Gagal mereset pengaturan')
    } finally {
      setLoading(false)
    }
  }

  // Update state change handlers to track changes
  const updateAiName = (value: string) => {
    setAiName(value)
    trackChanges()
  }

  const updateWelcomeMessage = (value: string) => {
    setWelcomeMessage(value)
    trackChanges()
  }

  const updateSelectedProfile = (value: string) => {
    setSelectedProfile(value)
    applyProfile(value)
    trackChanges()
  }

  const updateTextStyle = (updates: any) => {
    setTextStyle(prev => ({ ...prev, ...updates }))
    trackChanges()
  }

  const updateBehaviorSettings = (updates: any) => {
    setBehaviorSettings(prev => ({ ...prev, ...updates }))
    trackChanges()
  }

  const updateResponseSettings = (updates: any) => {
    setResponseSettings(prev => ({ ...prev, ...updates }))
    trackChanges()
  }

  const updateSystemPrompt = (value: string) => {
    setSystemPrompt(value)
    trackChanges()
  }

  const updateCustomInstructions = (value: string) => {
    setCustomInstructions(value)
    trackChanges()
  }

  const profiles = [
    {
      id: 'islamic_educator',
      name: 'Pendidik Islam',
      description: 'Fokus pada pembelajaran Islam dan edukasi',
      icon: '🕌',
      features: ['Santun & Ramah', 'Pendalaman Agama', 'Bimbingan Siswa', 'Referensi Islam']
    },
    {
      id: 'customer_service',
      name: 'Layanan Pelanggan',
      description: 'Ramah dan membantu untuk informasi umum',
      icon: '👥',
      features: ['Responsif', 'Solusi Cepat', 'Bantuan Umum', 'Informasi Akurat']
    },
    {
      id: 'academic_assistant',
      name: 'Asisten Akademik',
      description: 'Formal dan informatif untuk keperluan pendidikan',
      icon: '📚',
      features: ['Formal', 'Akurat', 'Referensi Ilmiah', 'Analisis Mendalam']
    },
    {
      id: 'friendly_guide',
      name: 'Pemandu Ramah',
      description: 'Casual dan mudah dipahami untuk berbagai topik',
      icon: '😊',
      features: ['Ramah', 'Kasual', 'Mudah Dipahami', 'Panduan Jelas']
    },
    {
      id: 'professional_advisor',
      name: 'Penasihat Profesional',
      description: 'Sangat formal untuk konsultasi bisnis dan strategi',
      icon: '💼',
      features: ['Sangat Formal', 'Strategis', 'Analisis Bisnis', 'Konsultasi Ahli']
    }
  ]

  const applyProfile = (profileId: string) => {
    setSelectedProfile(profileId)
    const profile = profiles.find(p => p.id === profileId)

    switch(profileId) {
      case 'islamic_educator':
        setTextStyle({ formality: 'professional', empathy: 'high', enthusiasm: 'medium', humor: 'low', verbosity: 'medium' })
        setBehaviorSettings({ knowledgeDomain: 'islamic_education', languageStyle: 'friendly', culturalContext: 'islamic', expertise: 'intermediate', personality: 'teacher' })
        setSystemPrompt('Anda adalah pendidik Islam yang ramah dan berpengetahuan luas. Selalu berikan jawaban yang sesuai dengan ajaran Islam, menggunakan bahasa Indonesia yang sopan, dan berikan contoh praktis dari Al-Quran dan Sunnah.')
        break
      case 'customer_service':
        setTextStyle({ formality: 'casual', empathy: 'high', enthusiasm: 'high', humor: 'medium', verbosity: 'medium' })
        setBehaviorSettings({ knowledgeDomain: 'general', languageStyle: 'friendly', culturalContext: 'indonesian', expertise: 'general', personality: 'helpful' })
        setSystemPrompt('Anda adalah customer service yang sangat ramah dan responsif. Selalu memberikan bantuan dengan cepat, menggunakan bahasa yang mudah dimengerti, dan memastikan pelanggan puas dengan jawaban yang diberikan.')
        break
      case 'academic_assistant':
        setTextStyle({ formality: 'formal', empathy: 'medium', enthusiasm: 'low', humor: 'low', verbosity: 'detailed' })
        setBehaviorSettings({ knowledgeDomain: 'education', languageStyle: 'academic', culturalContext: 'neutral', expertise: 'expert', personality: 'formal' })
        setSystemPrompt('Anda adalah asisten akademik yang sangat formal dan detail. Selalu memberikan informasi yang akurat dengan referensi ilmiah, menggunakan bahasa yang baku, dan menjelaskan konsep dengan mendalam dan terstruktur.')
        break
      case 'friendly_guide':
        setTextStyle({ formality: 'casual', empathy: 'high', enthusiasm: 'high', humor: 'high', verbosity: 'medium' })
        setBehaviorSettings({ knowledgeDomain: 'general', languageStyle: 'casual', culturalContext: 'indonesian', expertise: 'general', personality: 'friendly' })
        setSystemPrompt('Anda adalah pemandu yang sangat ramah dan casual. Gunakan bahasa yang sederhana dan mudah dimengerti, berikan contoh praktis, dan selalu membuat pembicaraan terasa nyaman dan menyenangkan.')
        break
      case 'professional_advisor':
        setTextStyle({ formality: 'formal', empathy: 'low', enthusiasm: 'low', humor: 'low', verbosity: 'detailed' })
        setBehaviorSettings({ knowledgeDomain: 'general', languageStyle: 'professional', culturalContext: 'western', expertise: 'expert', personality: 'formal' })
        setSystemPrompt('Anda adalah penasihat profesional yang sangat formal dan berpengalaman. Berikan analisis strategis yang mendalam, gunakan bahasa bisnis yang profesional, dan fokus pada solusi yang berdampak dan terukur.')
        break
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('persona.title')}</h2>
          <p className="text-muted-foreground">{t('persona.subtitle')}</p>
          {loading && (
            <p className="text-sm text-muted-foreground mt-1">Memuat persona...</p>
          )}
          {currentPersonaId && (
            <p className="text-sm text-muted-foreground mt-1">
              ID: {currentPersonaId.slice(0, 8)}...{hasChanges && ' (ada perubahan)'}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={resetSettings} disabled={loading || saving} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            {loading ? 'Memuat...' : t('persona.reset')}
          </Button>
          <Button
            onClick={saveSettings}
            disabled={loading || saving || !hasChanges}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : saved ? (
              <>
                <div className="h-4 w-4 text-green-500">✓</div>
                Tersimpan
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {hasChanges ? 'Simpan Perubahan' : t('persona.save')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="h-4 w-4 text-red-600">⚠</div>
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="h-4 w-4 text-green-600">✓</div>
          Persona berhasil disimpan!
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && !saved && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <div className="h-4 w-4 text-yellow-600">⚠</div>
          Anda memiliki perubahan yang belum disimpan
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Identitas
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Pengaturan
          </TabsTrigger>
        </TabsList>

        {/* Identity Tab */}
        <TabsContent value="identity" className="space-y-6">
          {/* Profile Chatbot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Profil Chatbot
              </CardTitle>
              <CardDescription>Pilih profil yang sesuai dengan kebutuhan Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedProfile === profile.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateSelectedProfile(profile.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{profile.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{profile.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{profile.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      {profile.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* AI Name & Welcome Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('persona.welcomeMessage')}
                </CardTitle>
                <CardDescription>{t('persona.welcomeDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-name">{t('persona.aiName')}</Label>
                  <Input
                    id="ai-name"
                    value={aiName}
                    onChange={(e) => updateAiName(e.target.value)}
                    placeholder={t('persona.aiNamePlaceholder')}
                    maxLength={50}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t('persona.nameCharacterCount', { current: aiName.length, max: 50 })}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-message">{t('persona.messageText')}</Label>
                  <Textarea
                    id="welcome-message"
                    value={welcomeMessage}
                    onChange={(e) => updateWelcomeMessage(e.target.value)}
                    placeholder={t('persona.welcomePlaceholder')}
                    className="min-h-[120px]"
                    maxLength={500}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{t('persona.characterCount', { current: welcomeMessage.length, max: 500 })}</span>
                    <Button variant="outline" size="sm" onClick={() => updateWelcomeMessage(welcomeMessage + ' 🌟')} disabled={loading}>
                      {t('persona.addEmoji')}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.quickTemplates')}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateWelcomeMessage('Halo! Saya siap membantu Anda dengan informasi tentang program pendidikan dan layanan kami. Ada yang bisa saya bantu? 😊')}
                      disabled={loading}
                    >
                      {t('persona.templates.friendly')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateWelcomeMessage('Selamat datang! Saya adalah asisten AI yang siap membantu dengan pertanyaan seputar pendidikan Islam dan layanan yayasan.')}
                      disabled={loading}
                    >
                      {t('persona.templates.professional')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateWelcomeMessage('Assalamualaikum Warahmatullahi Wabarakatuh! Selamat datang di layanan digital Yayasan Pendidikan Islam. Semoga informasi yang saya berikan bermanfaat untuk Anda. 🕌')}
                      disabled={loading}
                    >
                      {t('persona.templates.islamic')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('persona.preview')}
                </CardTitle>
                <CardDescription>{t('persona.previewDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-green-700 mb-1">{aiName}</div>
                      <div className="text-sm text-slate-700 leading-relaxed">{welcomeMessage}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Karakteristik */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Karakteristik AI
              </CardTitle>
              <CardDescription>Konfigurasi kepribadian dan perilaku dasar AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('persona.formality')}</Label>
                    <Select value={textStyle.formality} onValueChange={(value: 'casual' | 'professional' | 'formal') => setTextStyle({...textStyle, formality: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">{t('persona.formality.casual')}</SelectItem>
                        <SelectItem value="professional">{t('persona.formality.professional')}</SelectItem>
                        <SelectItem value="formal">{t('persona.formality.formal')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('persona.empathy')}</Label>
                    <Select value={textStyle.empathy} onValueChange={(value: 'low' | 'medium' | 'high') => setTextStyle({...textStyle, empathy: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('persona.empathy.low')}</SelectItem>
                        <SelectItem value="medium">{t('persona.empathy.medium')}</SelectItem>
                        <SelectItem value="high">{t('persona.empathy.high')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('persona.knowledgeDomain')}</Label>
                    <Select value={behaviorSettings.knowledgeDomain} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, knowledgeDomain: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="islamic_education">{t('persona.domains.islamicEducation')}</SelectItem>
                        <SelectItem value="general">{t('persona.domains.general')}</SelectItem>
                        <SelectItem value="education">{t('persona.domains.education')}</SelectItem>
                        <SelectItem value="religious">{t('persona.domains.religious')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('persona.enthusiasm')}</Label>
                    <Select value={textStyle.enthusiasm} onValueChange={(value: 'low' | 'medium' | 'high') => setTextStyle({...textStyle, enthusiasm: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('persona.enthusiasm.low')}</SelectItem>
                        <SelectItem value="medium">{t('persona.enthusiasm.medium')}</SelectItem>
                        <SelectItem value="high">{t('persona.enthusiasm.high')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('persona.verbosity')}</Label>
                    <Select value={textStyle.verbosity} onValueChange={(value: 'concise' | 'medium' | 'detailed') => setTextStyle({...textStyle, verbosity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concise">{t('persona.verbosity.concise')}</SelectItem>
                        <SelectItem value="medium">{t('persona.verbosity.medium')}</SelectItem>
                        <SelectItem value="detailed">{t('persona.verbosity.detailed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('persona.personality')}</Label>
                    <Select value={behaviorSettings.personality} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, personality: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="helpful">{t('persona.personalities.helpful')}</SelectItem>
                        <SelectItem value="formal">{t('persona.personalities.formal')}</SelectItem>
                        <SelectItem value="friendly">{t('persona.personalities.friendly')}</SelectItem>
                        <SelectItem value="teacher">{t('persona.personalities.teacher')}</SelectItem>
                        <SelectItem value="guide">{t('persona.personalities.guide')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Response Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('persona.responseSettings')}
                </CardTitle>
                <CardDescription>{t('persona.responseDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('persona.maxLength')}</Label>
                    <span className="text-sm text-muted-foreground">{responseSettings.maxLength} {t('persona.characters')}</span>
                  </div>
                  <Slider
                    value={[responseSettings.maxLength]}
                    onValueChange={(value) => setResponseSettings({...responseSettings, maxLength: value[0]})}
                    max={1000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('persona.minResponseTime')}</Label>
                    <span className="text-sm text-muted-foreground">{responseSettings.minResponseTime}s</span>
                  </div>
                  <Slider
                    value={[responseSettings.minResponseTime]}
                    onValueChange={(value) => setResponseSettings({...responseSettings, minResponseTime: value[0]})}
                    max={5}
                    min={0.5}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('persona.maxResponseTime')}</Label>
                    <span className="text-sm text-muted-foreground">{responseSettings.maxResponseTime}s</span>
                  </div>
                  <Slider
                    value={[responseSettings.maxResponseTime]}
                    onValueChange={(value) => setResponseSettings({...responseSettings, maxResponseTime: value[0]})}
                    max={10}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-emojis">{t('persona.useEmojis')}</Label>
                    <Switch
                      id="use-emojis"
                      checked={responseSettings.useEmojis}
                      onCheckedChange={(checked) => setResponseSettings({...responseSettings, useEmojis: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-greeting">{t('persona.includeGreeting')}</Label>
                    <Switch
                      id="include-greeting"
                      checked={responseSettings.includeGreeting}
                      onCheckedChange={(checked) => setResponseSettings({...responseSettings, includeGreeting: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="ask-followup">{t('persona.askFollowUp')}</Label>
                    <Switch
                      id="ask-followup"
                      checked={responseSettings.askFollowUp}
                      onCheckedChange={(checked) => setResponseSettings({...responseSettings, askFollowUp: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Pengaturan Tambahan
                </CardTitle>
                <CardDescription>Konfigurasi lanjutan untuk perilaku AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('persona.languageStyle')}</Label>
                  <Select value={behaviorSettings.languageStyle} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, languageStyle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">{t('persona.languageStyles.friendly')}</SelectItem>
                      <SelectItem value="professional">{t('persona.languageStyles.professional')}</SelectItem>
                      <SelectItem value="academic">{t('persona.languageStyles.academic')}</SelectItem>
                      <SelectItem value="casual">{t('persona.languageStyles.casual')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.culturalContext')}</Label>
                  <Select value={behaviorSettings.culturalContext} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, culturalContext: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indonesian">{t('persona.contexts.indonesian')}</SelectItem>
                      <SelectItem value="islamic">{t('persona.contexts.islamic')}</SelectItem>
                      <SelectItem value="western">{t('persona.contexts.western')}</SelectItem>
                      <SelectItem value="neutral">{t('persona.contexts.neutral')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.expertise')}</Label>
                  <Select value={behaviorSettings.expertise} onValueChange={(value) => setBehaviorSettings({...behaviorSettings, expertise: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t('persona.expertiseLevels.general')}</SelectItem>
                      <SelectItem value="intermediate">{t('persona.expertiseLevels.intermediate')}</SelectItem>
                      <SelectItem value="expert">{t('persona.expertiseLevels.expert')}</SelectItem>
                      <SelectItem value="scholar">{t('persona.expertiseLevels.scholar')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('persona.humor')}</Label>
                  <Select value={textStyle.humor} onValueChange={(value: 'low' | 'medium' | 'high') => setTextStyle({...textStyle, humor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('persona.humor.low')}</SelectItem>
                      <SelectItem value="medium">{t('persona.humor.medium')}</SelectItem>
                      <SelectItem value="high">{t('persona.humor.high')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                System Prompt
              </CardTitle>
              <CardDescription>Pesan sistem untuk mendefinisikan karakteristik AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Definisikan karakteristik AI Anda di sini..."
                className="min-h-[150px]"
                value={systemPrompt}
                onChange={(e) => updateSystemPrompt(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                System prompt akan menentukan perilaku dasar AI dalam setiap percakapan.
              </p>
            </CardContent>
          </Card>

          {/* Custom Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Instruksi Tambahan
              </CardTitle>
              <CardDescription>Instruksi kustom untuk perilaku spesifik</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Tambahkan instruksi kustom untuk perilaku spesifik..."
                className="min-h-[100px]"
                value={customInstructions}
                onChange={(e) => updateCustomInstructions(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Instruksi tambahan untuk perilaku spesifik dalam konteks tertentu.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}