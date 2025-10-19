'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Globe,
  ArrowLeft,
  Save,
  Download,
  Edit,
  Trash2,
  Settings,
  Bot,
  MessageCircle,
  Smartphone,
  Palette,
  Eye,
  EyeOff,
  Activity,
  Calendar,
  Users,
  BarChart3,
} from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

interface WordPressIntegration {
  id: string
  name: string
  url: string | null
  status: 'active' | 'inactive' | 'error'
  chatbotId: string
  settings: any
  lastSyncAt: string | null
  createdAt: string
  updatedAt: string
  chatbot: {
    id: string
    name: string
    description?: string | null
    apiKey: string | null
  }
  _count: {
    sessions: number
  }
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

export default function WordPressIntegrationDetailPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const params = useParams()
  const integrationId = params.integrationId as string

  const [integration, setIntegration] = useState<WordPressIntegration | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Form data
  const [integrationName, setIntegrationName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
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

  const dateLocale = locale === 'id' ? idLocale : enUS

  useEffect(() => {
    fetchIntegration()
  }, [integrationId])

  const fetchIntegration = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/wordpress/integrations/${integrationId}`)
      const result = await response.json()

      if (result.success) {
        const data = result.data
        setIntegration(data)
        setIntegrationName(data.name)
        setWebsiteUrl(data.url || '')
        setDescription(data.settings?.description || '')

        // Load plugin settings
        if (data.settings?.config) {
          setPluginSettings({
            position: data.settings.config.position || 'bottom-right',
            showOnMobile: data.settings.config.showOnMobile ?? true,
            autoOpen: data.settings.config.autoOpen ?? false,
            welcomeMessage: data.settings.config.welcomeMessage || 'Hello! How can I help you today?',
            placeholder: data.settings.config.placeholder || 'Type your message...',
          })
        }

        // Load theme settings
        if (data.settings?.theme) {
          setThemeSettings({
            primaryColor: data.settings.theme.primaryColor || '#10b981',
            secondaryColor: data.settings.theme.secondaryColor || '#059669',
            textColor: data.settings.theme.textColor || '#ffffff',
            backgroundColor: data.settings.theme.backgroundColor || '#ffffff',
            buttonColor: data.settings.theme.buttonColor || '#10b981',
          })
        }
      } else {
        setError(result.error || 'Failed to fetch WordPress integration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`/api/wordpress/integrations/${integrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: integrationName,
          url: websiteUrl || null,
          settings: {
            ...integration?.settings,
            theme: themeSettings,
            config: pluginSettings,
            description,
          },
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Integration updated successfully!')
        setIsEditing(false)
        fetchIntegration()
      } else {
        setError(result.error || 'Failed to update integration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this WordPress integration? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/wordpress/integrations/${integrationId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        router.push('/dashboard/integrations/wordpress')
      } else {
        setError(result.error || 'Failed to delete integration')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDownloadPlugin = async () => {
    try {
      const response = await fetch(`/api/wordpress/plugin/download/${integrationId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Download failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${integrationName.toLowerCase().replace(/\s+/g, '-')}-plugin.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      alert(err instanceof Error ? err.message : 'Failed to download plugin')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    try {
      return format(new Date(dateString), 'PPp', { locale: dateLocale })
    } catch {
      return 'Invalid date'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  if (!integration) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Integration not found</h3>
        <p className="text-gray-500 mb-4">The WordPress integration you're looking for doesn't exist.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              {integration.name}
            </h1>
            <p className="text-gray-500 mt-1">
              WordPress integration details and configuration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDownloadPlugin}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Plugin
          </Button>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="outline"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          )}
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Integration Name</Label>
                      {isEditing ? (
                        <Input
                          value={integrationName}
                          onChange={(e) => setIntegrationName(e.target.value)}
                        />
                      ) : (
                        <p className="font-medium">{integration.name}</p>
                      )}
                    </div>
                    <div>
                      <Label>Status</Label>
                      <div>
                        {integration.status === 'active' ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : integration.status === 'inactive' ? (
                          <Badge variant="secondary">Inactive</Badge>
                        ) : (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Website URL</Label>
                      {isEditing ? (
                        <Input
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                        />
                      ) : (
                        <p>
                          {integration.url ? (
                            <a
                              href={integration.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Globe className="w-4 h-4" />
                              {integration.url}
                            </a>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Connected Chatbot</Label>
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{integration.chatbot.name}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    {isEditing ? (
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-600">
                        {integration.settings?.description || 'No description provided'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {integration._count.sessions}
                      </div>
                      <div className="text-sm text-gray-500">Total Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {integration.status === 'active' ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-sm text-gray-500">Current Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatDate(integration.createdAt)}
                      </div>
                      <div className="text-sm text-gray-500">Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatDate(integration.lastSyncAt)}
                      </div>
                      <div className="text-sm text-gray-500">Last Sync</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
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
                      disabled={!isEditing}
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
                    <Label>Welcome Message</Label>
                    <Input
                      value={pluginSettings.welcomeMessage}
                      onChange={(e) =>
                        setPluginSettings({ ...pluginSettings, welcomeMessage: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label>Input Placeholder</Label>
                    <Input
                      value={pluginSettings.placeholder}
                      onChange={(e) =>
                        setPluginSettings({ ...pluginSettings, placeholder: e.target.value })
                      }
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-6">
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
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) =>
                            setThemeSettings({ ...themeSettings, primaryColor: e.target.value })
                          }
                          className="w-20 h-10"
                          disabled={!isEditing}
                        />
                        <Input
                          value={themeSettings.primaryColor}
                          onChange={(e) =>
                            setThemeSettings({ ...themeSettings, primaryColor: e.target.value })
                          }
                          placeholder="#10b981"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Button Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={themeSettings.buttonColor}
                          onChange={(e) =>
                            setThemeSettings({ ...themeSettings, buttonColor: e.target.value })
                          }
                          className="w-20 h-10"
                          disabled={!isEditing}
                        />
                        <Input
                          value={themeSettings.buttonColor}
                          onChange={(e) =>
                            setThemeSettings({ ...themeSettings, buttonColor: e.target.value })
                          }
                          placeholder="#10b981"
                          disabled={!isEditing}
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

              {/* Preview */}
              {showPreview && (
                <Card>
                  <CardHeader>
                    <CardTitle>Widget Preview</CardTitle>
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
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Analytics Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-500">
                      Detailed analytics and usage statistics will be available in the next update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleDownloadPlugin}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Plugin
              </Button>

              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Settings'}
              </Button>

              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Integration
              </Button>
            </CardContent>
          </Card>

          {/* Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Created: {formatDate(integration.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <span>Last Sync: {formatDate(integration.lastSyncAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-gray-400" />
                <span>Chatbot: {integration.chatbot.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}