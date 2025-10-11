'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Phone,
  MessageCircle,
  Settings,
  Key,
  History,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Shield,
  Globe,
  Link,
  Unlink,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Square,
  Trash2
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function WhatsAppIntegration() {
  const { t, language } = useI18n()
  const [activeTab, setActiveTab] = useState('connection')
  const [integrations, setIntegrations] = useState([])
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    apiKey: '',
    webhookSecret: '',
    businessId: '',
    autoRespond: true,
    welcomeMessage: '',
    defaultMessage: ''
  })

  const mockIntegrations = [
    {
      id: '1',
      name: 'WhatsApp Business 1',
      phoneNumber: '+62812345678',
      status: 'connected',
      lastSyncAt: new Date(),
      totalMessages: 150,
      activeChats: 5,
      autoRespond: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Customer Service',
      phoneNumber: '+62898765432',
      status: 'disconnected',
      lastSyncAt: new Date(Date.now() - 86400000),
      totalMessages: 89,
      activeChats: 0,
      autoRespond: false,
      createdAt: new Date('2024-02-01')
    }
  ]

  const mockChatHistory = [
    {
      id: '1',
      contactName: 'John Doe',
      phoneNumber: '+62812345678',
      lastMessage: 'Halo, saya ingin bertanya tentang produk',
      lastMessageAt: new Date(),
      messageCount: 12,
      unreadCount: 2,
      status: 'active'
    },
    {
      id: '2',
      contactName: 'Jane Smith',
      phoneNumber: '+62898765432',
      lastMessage: 'Terima kasih atas bantuannya',
      lastMessageAt: new Date(Date.now() - 3600000),
      messageCount: 8,
      unreadCount: 0,
      status: 'completed'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500'
      case 'connecting':
        return 'bg-yellow-500'
      case 'disconnected':
        return 'bg-red-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'connecting':
        return <RefreshCw className="w-4 h-4 text-yellow-500 animate-spin" />
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const handleConnectWhatsApp = async () => {
    setIsConnecting(true)
    setConnectionStatus('connecting')

    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus('connected')
      setIsConnecting(false)

      // Add to integrations list
      const newIntegration = {
        id: Date.now().toString(),
        name: formData.name || 'WhatsApp Business',
        phoneNumber: formData.phoneNumber,
        status: 'connected',
        lastSyncAt: new Date(),
        totalMessages: 0,
        activeChats: 0,
        autoRespond: formData.autoRespond,
        createdAt: new Date()
      }

      setIntegrations([newIntegration, ...integrations])
      setSelectedIntegration(newIntegration)

      // Reset form
      setFormData({
        name: '',
        phoneNumber: '',
        apiKey: '',
        webhookSecret: '',
        businessId: '',
        autoRespond: true,
        welcomeMessage: '',
        defaultMessage: ''
      })
    }, 2000)
  }

  const handleDisconnectWhatsApp = (integrationId: string) => {
    setIntegrations(integrations.filter(int => int.id !== integrationId))
    if (selectedIntegration?.id === integrationId) {
      setSelectedIntegration(null)
    }
    setConnectionStatus('disconnected')
  }

  const handleCopyApiKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey)
  }

  const filteredChatHistory = mockChatHistory.filter(chat =>
    chat.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.phoneNumber.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('integrations.whatsapp.title')}</h1>
          <p className="text-muted-foreground">
            {t('integrations.whatsapp.description')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus)}`} />
            {t(`integrations.whatsapp.status.${connectionStatus}`)}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="connection" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            {t('integrations.whatsapp.tabs.connection')}
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            {t('integrations.whatsapp.tabs.chats')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t('integrations.whatsapp.tabs.settings')}
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t('integrations.whatsapp.tabs.api')}
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {t('integrations.whatsapp.tabs.preview')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Connection Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  {t('integrations.whatsapp.connection.setup')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.whatsapp.connection.setupDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('integrations.whatsapp.connection.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('integrations.whatsapp.connection.namePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t('integrations.whatsapp.connection.phoneNumber')}</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+62812345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">{t('integrations.whatsapp.connection.apiKey')}</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      placeholder={t('integrations.whatsapp.connection.apiKeyPlaceholder')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">{t('integrations.whatsapp.connection.webhookSecret')}</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    placeholder={t('integrations.whatsapp.connection.webhookSecretPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessId">{t('integrations.whatsapp.connection.businessId')}</Label>
                  <Input
                    id="businessId"
                    value={formData.businessId}
                    onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    placeholder={t('integrations.whatsapp.connection.businessIdPlaceholder')}
                  />
                </div>

                <Button
                  onClick={handleConnectWhatsApp}
                  disabled={isConnecting || !formData.name || !formData.phoneNumber || !formData.apiKey}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {t('integrations.whatsapp.connection.connecting')}
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      {t('integrations.whatsapp.connection.connect')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Active Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('integrations.whatsapp.connection.activeIntegrations')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.whatsapp.connection.activeIntegrationsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockIntegrations.map((integration) => (
                    <div
                      key={integration.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`} />
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.phoneNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnectWhatsApp(integration.id)}
                        >
                          <Unlink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {mockIntegrations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>{t('integrations.whatsapp.connection.noIntegrations')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('integrations.whatsapp.connection.status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{t('integrations.whatsapp.connection.encrypted')}</p>
                    <p className="text-xs text-muted-foreground">End-to-end encryption</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{t('integrations.whatsapp.connection.realTime')}</p>
                    <p className="text-xs text-muted-foreground">Real-time sync</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">{t('integrations.whatsapp.connection.multiUser')}</p>
                    <p className="text-xs text-muted-foreground">Multi-device support</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">{t('integrations.whatsapp.connection.monitoring')}</p>
                    <p className="text-xs text-muted-foreground">24/7 monitoring</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                {t('integrations.whatsapp.chats.title')}
              </CardTitle>
              <CardDescription>
                {t('integrations.whatsapp.chats.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('integrations.whatsapp.chats.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('integrations.whatsapp.chats.filter')}
                </Button>
              </div>

              {/* Chat List */}
              <div className="space-y-4">
                {filteredChatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                        {chat.contactName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{chat.contactName}</p>
                          <p className="text-sm text-muted-foreground">{chat.phoneNumber}</p>
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {chat.lastMessageAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={chat.status === 'active' ? 'default' : 'secondary'}>
                        {t(`integrations.whatsapp.chats.status.${chat.status}`)}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredChatHistory.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>{t('integrations.whatsapp.chats.noChats')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Auto-respond Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('integrations.whatsapp.settings.autoRespond')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.whatsapp.settings.autoRespondDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoRespond">{t('integrations.whatsapp.settings.enableAutoRespond')}</Label>
                  <Switch
                    id="autoRespond"
                    checked={formData.autoRespond}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoRespond: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">{t('integrations.whatsapp.settings.welcomeMessage')}</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    placeholder={t('integrations.whatsapp.settings.welcomeMessagePlaceholder')}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultMessage">{t('integrations.whatsapp.settings.defaultMessage')}</Label>
                  <Textarea
                    id="defaultMessage"
                    value={formData.defaultMessage}
                    onChange={(e) => setFormData({ ...formData, defaultMessage: e.target.value })}
                    placeholder={t('integrations.whatsapp.settings.defaultMessagePlaceholder')}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Connection Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('integrations.whatsapp.settings.connection')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.whatsapp.settings.connectionDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('integrations.whatsapp.settings.syncInterval')}</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="realtime">{t('integrations.whatsapp.settings.realtime')}</option>
                    <option value="1min">{t('integrations.whatsapp.settings.everyMinute')}</option>
                    <option value="5min">{t('integrations.whatsapp.settings.every5Minutes')}</option>
                    <option value="15min">{t('integrations.whatsapp.settings.every15Minutes')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.whatsapp.settings.timeout')}</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                    placeholder={t('integrations.whatsapp.settings.timeoutPlaceholder')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('integrations.whatsapp.settings.retryFailed')}</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('integrations.whatsapp.settings.notifyErrors')}</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                {t('integrations.whatsapp.api.title')}
              </CardTitle>
              <CardDescription>
                {t('integrations.whatsapp.api.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.whatsapp.api.apiKeys')}</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Production API Key</p>
                      <p className="text-sm text-muted-foreground">whatsapp_prod_1234567890</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyApiKey('whatsapp_prod_1234567890')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Webhook Secret</p>
                      <p className="text-sm text-muted-foreground">webhook_secret_abcdef123456</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyApiKey('webhook_secret_abcdef123456')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('integrations.whatsapp.api.generateNewKey')}
                </Button>
              </div>

              {/* API Endpoints */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.whatsapp.api.endpoints')}</h3>

                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Send Message</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      POST /api/whatsapp/send
                    </code>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Webhook URL</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      POST /api/whatsapp/webhook
                    </code>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Get Messages</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      GET /api/whatsapp/messages
                    </code>
                  </div>
                </div>
              </div>

              {/* API Documentation */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.whatsapp.api.documentation')}</h3>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('integrations.whatsapp.api.downloadDocs')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t('integrations.whatsapp.preview.title')}
              </CardTitle>
              <CardDescription>
                {t('integrations.whatsapp.preview.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Mobile Preview */}
                <div className="mx-auto w-full max-w-sm">
                  <div className="bg-gray-900 rounded-3xl p-4 shadow-2xl">
                    <div className="bg-white rounded-2xl overflow-hidden">
                      {/* Status Bar */}
                      <div className="bg-green-500 px-4 py-2 text-white text-xs flex items-center justify-between">
                        <span>9:41 AM</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-3 border border-white rounded-sm">
                            <div className="w-full h-full bg-white rounded-sm scale-x-75 origin-left"></div>
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Header */}
                      <div className="bg-green-600 px-4 py-3 text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">AI Assistant</p>
                          <p className="text-xs opacity-90">Online</p>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="p-4 space-y-3 bg-gray-50 min-h-[200px]">
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                            <p className="text-sm">Halo, saya ingin bertanya tentang produk Anda</p>
                            <p className="text-xs text-gray-500 mt-1">9:35 AM</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="bg-green-500 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                            <p className="text-sm">Halo! Selamat datang di layanan kami. Ada yang bisa saya bantu?</p>
                            <p className="text-xs opacity-75 mt-1">9:36 AM</p>
                          </div>
                        </div>

                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                            <p className="text-sm">Terima kasih, saya tertarik dengan paket premium</p>
                            <p className="text-xs text-gray-500 mt-1">9:37 AM</p>
                          </div>
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="bg-white border-t px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
                            <input
                              type="text"
                              placeholder="Type a message..."
                              className="bg-transparent flex-1 outline-none text-sm"
                              readOnly
                            />
                            <Smile className="w-4 h-4 text-gray-500" />
                          </div>
                          <button className="bg-green-500 text-white rounded-full p-2">
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Controls */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('integrations.whatsapp.preview.refresh')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smartphone className="w-4 h-4 mr-2" />
                    {t('integrations.whatsapp.preview.mobile')}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Monitor className="w-4 h-4 mr-2" />
                    {t('integrations.whatsapp.preview.desktop')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import missing icons
import { Plus, Send, Smile, Monitor } from 'lucide-react'