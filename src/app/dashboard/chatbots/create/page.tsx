'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Bot,
  ArrowLeft,
  Save,
  MessageSquare,
  Users,
  Zap,
  Globe,
  Crown,
  AlertCircle,
  CheckCircle,
  Lock,
} from 'lucide-react'

interface SubscriptionData {
  id: string
  status: string
  package: {
    id: string
    name: string
    displayName: string
    maxChatbots: number | null
  }
}

interface UsageStats {
  chatbots: {
    current: number
    limit: number | null
    isUnlimited: boolean
  }
}

const chatbotTemplates = [
  {
    id: 'customer-support',
    name: 'Layanan Pelanggan',
    description: 'Menangani pertanyaan dan tiket dukungan pelanggan',
    icon: '🎧',
    persona: 'Perwakilan layanan pelanggan yang membantu dan profesional',
    color: 'blue'
  },
  {
    id: 'sales-assistant',
    name: 'Asisten Penjualan',
    description: 'Membantu pelanggan dengan informasi produk dan pembelian',
    icon: '💼',
    persona: 'Konsultan penjualan yang berpengetahuan dan persuasif',
    color: 'green'
  },
  {
    id: 'faq-bot',
    name: 'Bot FAQ',
    description: 'Menjawab pertanyaan yang sering diajukan',
    icon: '❓',
    persona: 'Asisten basis pengetahuan yang informatif dan jelas',
    color: 'purple'
  },
  {
    id: 'custom',
    name: 'Chatbot Kustom',
    description: 'Buat asisten AI kustom Anda sendiri',
    icon: '🤖',
    persona: 'Kepribadian kustom berdasarkan persyaratan Anda',
    color: 'gray'
  }
]

export default function CreateChatbotPage() {
  const router = useRouter()
  const { t } = useI18n()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    persona: '',
    language: 'id',
    model: 'gpt-3.5-turbo'
  })
  const [isCreating, setIsCreating] = useState(false)

  // Subscription states
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [canCreateChatbot, setCanCreateChatbot] = useState(false)

  // Check subscription on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        // Fetch active subscription
        const subscriptionResponse = await fetch('/api/subscriptions?includePackage=true')
        if (subscriptionResponse.ok) {
          const subscriptionResult = await subscriptionResponse.json()
          if (subscriptionResult.success && subscriptionResult.data.activeSubscription) {
            const activeSub = subscriptionResult.data.activeSubscription

            // Fetch detailed subscription info
            const detailResponse = await fetch(`/api/subscriptions/${activeSub.id}`)
            if (detailResponse.ok) {
              const detailResult = await detailResponse.json()
              if (detailResult.success) {
                setSubscription(detailResult.data.subscription)
                setUsageStats(detailResult.data.usageStats)
                setCanCreateChatbot(detailResult.data.canCreateChatbot)
              }
            }
          } else {
            // No active subscription
            setCanCreateChatbot(false)
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error)
        setCanCreateChatbot(false)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = chatbotTemplates.find(t => t.id === templateId)
    if (template) {
      setFormData(prev => ({
        ...prev,
        name: template.name !== 'Chatbot Kustom' ? template.name : '',
        description: template.description,
        persona: template.persona
      }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateChatbot = async () => {
    if (!formData.name.trim()) {
      alert(t('chatbot.create.nameRequired', 'Please enter a chatbot name'))
      return
    }

    // Check subscription before creating
    if (!canCreateChatbot) {
      if (!subscription) {
        alert('Anda perlu berlangganan paket untuk membuat chatbot. Silakan pilih paket yang sesuai terlebih dahulu.')
        router.push('/dashboard')
        return
      } else if (usageStats && !usageStats.chatbots.isUnlimited && usageStats.chatbots.current >= usageStats.chatbots.limit) {
        alert(`Anda telah mencapai batas maksimum chatbot (${usageStats.chatbots.limit}). Upgrade paket Anda untuk membuat lebih banyak chatbot.`)
        router.push('/dashboard')
        return
      }
    }

    setIsCreating(true)

    try {
      // Create chatbot API call
      const response = await fetch('/api/user/chatbots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subscriptionId: subscription?.id,
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Redirect to the chatbot dashboard
        router.push(`/dashboard/chatbot/${result.data.chatbot.id}`)
      } else {
        throw new Error(result.message || 'Failed to create chatbot')
      }
    } catch (error) {
      console.error('Failed to create chatbot:', error)
      alert(t('chatbot.create.error', 'Failed to create chatbot. Please try again.'))
    } finally {
      setIsCreating(false)
    }
  }

  const handleGoBack = () => {
    router.push('/dashboard')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back', 'Back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('chatbot.create.title', 'Create New Chatbot')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('chatbot.create.subtitle', 'Set up your AI assistant with a template or customize from scratch')}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Memeriksa status berlangganan...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back', 'Back')}
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('chatbot.create.title', 'Create New Chatbot')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('chatbot.create.subtitle', 'Set up your AI assistant with a template or customize from scratch')}
          </p>
        </div>
      </div>

      {/* Subscription Status */}
      {subscription && canCreateChatbot && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <span className="text-sm font-medium text-green-800">
                  Paket {subscription.package.displayName} Aktif
                </span>
                {usageStats && (
                  <span className="text-sm text-green-600 ml-2">
                    ({usageStats.chatbots.current}/{usageStats.chatbots.isUnlimited ? '∞' : usageStats.chatbots.limit} chatbot)
                  </span>
                )}
              </div>
              <Crown className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {!canCreateChatbot && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <span className="text-sm font-medium text-red-800">
                  {!subscription
                    ? 'Anda perlu berlangganan paket untuk membuat chatbot'
                    : usageStats && !usageStats.chatbots.isUnlimited && usageStats.chatbots.current >= usageStats.chatbots.limit
                      ? `Anda telah mencapai batas maksimum chatbot (${usageStats.chatbots.limit})`
                      : 'Subscription tidak valid'
                  }
                </span>
              </div>
              <Lock className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-3">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                size="sm"
                className="bg-white text-red-600 border-red-300 hover:bg-red-100"
              >
                <Crown className="mr-2 h-3 w-3" />
                {!subscription ? 'Pilih Paket' : 'Upgrade Paket'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Choose Template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {t('chatbot.create.chooseTemplate', 'Choose a Template')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chatbotTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border-2 rounded-lg transition-all ${
                  !canCreateChatbot
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                    : selectedTemplate === template.id
                      ? 'border-green-500 bg-green-50 cursor-pointer'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                }`}
                onClick={() => canCreateChatbot && handleTemplateSelect(template.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{template.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t('chatbot.create.basicInfo', 'Basic Information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">{t('chatbot.create.name', 'Chatbot Name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => canCreateChatbot && handleInputChange('name', e.target.value)}
                placeholder={t('chatbot.create.namePlaceholder', 'Enter chatbot name')}
                className="mt-1"
                disabled={!canCreateChatbot}
              />
            </div>
            <div>
              <Label htmlFor="language">{t('chatbot.create.language', 'Primary Language')}</Label>
              <Select value={formData.language} onValueChange={(value) => canCreateChatbot && handleInputChange('language', value)} disabled={!canCreateChatbot}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t('chatbot.create.description', 'Description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => canCreateChatbot && handleInputChange('description', e.target.value)}
              placeholder={t('chatbot.create.descriptionPlaceholder', 'Describe what this chatbot does')}
              rows={3}
              className="mt-1"
              disabled={!canCreateChatbot}
            />
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Persona Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            {t('chatbot.create.persona', 'Persona & Personality')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="persona">{t('chatbot.create.personaDescription', 'AI Persona Description')}</Label>
            <Textarea
              id="persona"
              value={formData.persona}
              onChange={(e) => canCreateChatbot && handleInputChange('persona', e.target.value)}
              placeholder={t('chatbot.create.personaPlaceholder', 'Describe the AI personality, tone, and behavior')}
              rows={4}
              className="mt-1"
              disabled={!canCreateChatbot}
            />
            <p className="text-sm text-gray-500 mt-2">
              {t('chatbot.create.personaHelp', 'Example: "Friendly, professional, and patient customer service representative that speaks clearly and provides helpful solutions."')}
            </p>
          </div>

          <div>
            <Label htmlFor="model">{t('chatbot.create.aiModel', 'AI Model')}</Label>
            <Select value={formData.model} onValueChange={(value) => canCreateChatbot && handleInputChange('model', value)} disabled={!canCreateChatbot}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Cepat & Hemat Biaya)</SelectItem>
                <SelectItem value="gpt-4">GPT-4 (Paling Cakap)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Seimbang)</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus (Lanjutan)</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Seimbang)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleGoBack}
          disabled={isCreating}
        >
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          onClick={handleCreateChatbot}
          disabled={isCreating || !formData.name.trim() || !canCreateChatbot}
          className={!canCreateChatbot ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t('chatbot.create.creating', 'Creating...')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('chatbot.create.create', 'Create Chatbot')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}