'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Globe,
  ArrowLeft,
  Save,
  Bot,
  Settings,
  Palette,
  MessageCircle,
  Smartphone,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react'

interface Chatbot {
  id: string
  name: string
  description?: string | null
}

interface PluginSettings {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  showOnMobile: boolean
  autoOpen: boolean
  welcomeMessage: string
  placeholder: string
}

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  buttonColor: string
}

export default function CreateWordPressIntegrationPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form data
  const [integrationName, setIntegrationName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [description, setDescription] = useState('')

  // Plugin settings
  const [pluginSettings, setPluginSettings] = useState<PluginSettings>({
    position: 'bottom-right',
    showOnMobile: true,
    autoOpen: false,
    welcomeMessage: 'Hello! How can I help you today?',
    placeholder: 'Type your message...',
  })

  // Theme settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    textColor: '#ffffff',
    backgroundColor: '#ffffff',
    buttonColor: '#10b981',
  })

  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchChatbots()
  }, [])

  const fetchChatbots = async () => {
    setIsLoadingChatbots(true)
    try {
      const response = await fetch('/api/user/chatbots')
      const result = await response.json()

      if (result.success) {
        setChatbots(result.data.chatbots)
      } else {
        setError(result.error || 'Failed to fetch chatbots')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chatbots')
    } finally {
      setIsLoadingChatbots(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/wordpress/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: integrationName,
          chatbotId: selectedChatbotId,
          url: websiteUrl || null,
          settings: {
            theme: themeSettings,
            config: pluginSettings,
            description,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('WordPress integration created successfully!')
        setTimeout(() => {
          router.push('/dashboard/integrations/wordpress')
        }, 2000)
      } else {
        setError(result.error || 'Failed to create WordPress integration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePlugin = async () => {
    if (!integrationName || !selectedChatbotId) {
      setError('Please fill in the integration name and select a chatbot first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/wordpress/plugin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pluginName: integrationName,
          chatbotId: selectedChatbotId,
          theme: themeSettings,
          settings: pluginSettings,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('WordPress plugin generated successfully!')
        setTimeout(() => {
          router.push('/dashboard/integrations/wordpress')
        }, 2000)
      } else {
        setError(result.error || 'Failed to generate WordPress plugin')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingChatbots) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Create WordPress Integration
          </h1>
          <p className="text-gray-500 mt-1">
            Set up a new WordPress chatbot integration and generate your plugin
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="integrationName">Integration Name *</Label>
                <Input
                  id="integrationName"
                  value={integrationName}
                  onChange={(e) => setIntegrationName(e.target.value)}
                  placeholder="My Website Chatbot"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This name will be used for your WordPress plugin
                </p>
              </div>

              <div>
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: The URL where this integration will be installed
                </p>
              </div>

              <div>
                <Label htmlFor="chatbot">Select Chatbot *</Label>
                <Select value={selectedChatbotId} onValueChange={setSelectedChatbotId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a chatbot to connect" />
                  </SelectTrigger>
                  <SelectContent>
                    {chatbots.length === 0 ? (
                      <SelectItem value="" disabled>
                        No chatbots available
                      </SelectItem>
                    ) : (
                      chatbots.map((chatbot) => (
                        <SelectItem key={chatbot.id} value={chatbot.id}>
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            {chatbot.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Choose which chatbot to connect to this WordPress integration
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description of this integration..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Widget Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Widget Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Widget Position</Label>
                <Select
                  value={pluginSettings.position}
                  onValueChange={(value: any) =>
                    setPluginSettings({ ...pluginSettings, position: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  value={pluginSettings.welcomeMessage}
                  onChange={(e) =>
                    setPluginSettings({ ...pluginSettings, welcomeMessage: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="placeholder">Input Placeholder</Label>
                <Input
                  id="placeholder"
                  value={pluginSettings.placeholder}
                  onChange={(e) =>
                    setPluginSettings({ ...pluginSettings, placeholder: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show on Mobile</Label>
                  <p className="text-sm text-gray-500">
                    Display chat widget on mobile devices
                  </p>
                </div>
                <Switch
                  checked={pluginSettings.showOnMobile}
                  onCheckedChange={(checked) =>
                    setPluginSettings({ ...pluginSettings, showOnMobile: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Open</Label>
                  <p className="text-sm text-gray-500">
                    Automatically open chat widget on page load
                  </p>
                </div>
                <Switch
                  checked={pluginSettings.autoOpen}
                  onCheckedChange={(checked) =>
                    setPluginSettings({ ...pluginSettings, autoOpen: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) =>
                        setThemeSettings({ ...themeSettings, primaryColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      value={themeSettings.primaryColor}
                      onChange={(e) =>
                        setThemeSettings({ ...themeSettings, primaryColor: e.target.value })
                      }
                      placeholder="#10b981"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="buttonColor">Button Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="buttonColor"
                      type="color"
                      value={themeSettings.buttonColor}
                      onChange={(e) =>
                        setThemeSettings({ ...themeSettings, buttonColor: e.target.value })
                      }
                      className="w-20 h-10"
                    />
                    <Input
                      value={themeSettings.buttonColor}
                      onChange={(e) =>
                        setThemeSettings({ ...themeSettings, buttonColor: e.target.value })
                      }
                      placeholder="#10b981"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Widget Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`absolute ${
                      pluginSettings.position === 'bottom-right'
                        ? 'bottom-4 right-4'
                        : pluginSettings.position === 'bottom-left'
                        ? 'bottom-4 left-4'
                        : pluginSettings.position === 'top-right'
                        ? 'top-4 right-4'
                        : 'top-4 left-4'
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg"
                      style={{ backgroundColor: themeSettings.buttonColor }}
                    >
                      <MessageCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Chat preview */}
                  <div className="absolute bottom-20 right-4 w-64 h-48 bg-white rounded-lg shadow-xl border border-gray-200 hidden">
                    <div
                      className="p-3 rounded-t-lg flex items-center justify-between"
                      style={{ backgroundColor: themeSettings.primaryColor }}
                    >
                      <span className="text-white text-sm font-medium">Chat Assistant</span>
                      <span className="text-white text-xs">×</span>
                    </div>
                    <div className="p-3 text-sm text-gray-600">
                      {pluginSettings.welcomeMessage}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      <input
                        type="text"
                        placeholder={pluginSettings.placeholder}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm"
                        readOnly
                      />
                      <button
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: themeSettings.primaryColor }}
                      >
                        <span className="text-xs">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !integrationName || !selectedChatbotId}
                className="w-full"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Create Integration
              </Button>

              <Button
                onClick={handleGeneratePlugin}
                disabled={isLoading || !integrationName || !selectedChatbotId}
                variant="outline"
                className="w-full"
              >
                <Globe className="w-4 h-4 mr-2" />
                Generate Plugin Only
              </Button>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle>Help & Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <Bot className="w-4 h-4 mt-0.5 text-gray-400" />
                <p>Make sure you have selected a chatbot with an API key configured.</p>
              </div>
              <div className="flex items-start gap-2">
                <Palette className="w-4 h-4 mt-0.5 text-gray-400" />
                <p>Customize colors to match your website branding.</p>
              </div>
              <div className="flex items-start gap-2">
                <Smartphone className="w-4 h-4 mt-0.5 text-gray-400" />
                <p>Test the widget on mobile devices to ensure proper display.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}