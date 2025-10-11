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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  MessageCircle,
  Key,
  Settings,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Code,
  BarChart3,
  Palette,
  Globe,
  Activity,
  CheckCircle,
  AlertCircle,
  Play,
  Square,
  ExternalLink,
  Download
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function EmbedChatIntegration() {
  const { t, language } = useI18n()
  const [activeTab, setActiveTab] = useState('overview')
  const [showApiKey, setShowApiKey] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [embedCode, setEmbedCode] = useState('')
  const [domains, setDomains] = useState(['example.com', 'mysite.com'])
  const [newDomain, setNewDomain] = useState('')

  // Mock statistics
  const [stats, setStats] = useState({
    totalEmbeds: 12,
    activeChats: 45,
    messagesToday: 234,
    conversionRate: 12.5,
    totalViews: 5678,
    totalInteractions: 890,
    avgSessionDuration: '4:32',
    bounceRate: 35.2
  })

  // Mock active widgets
  const [activeWidgets, setActiveWidgets] = useState([
    {
      id: '1',
      name: 'Main Website Widget',
      domain: 'example.com',
      status: 'active',
      messages: 1234,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Blog Widget',
      domain: 'blog.example.com',
      status: 'active',
      messages: 567,
      createdAt: new Date('2024-02-01')
    }
  ])

  // Widget customization settings
  const [widgetSettings, setWidgetSettings] = useState({
    position: 'bottomRight',
    theme: 'auto',
    primaryColor: '#10b981',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    welcomeMessage: language === 'id' ? 'Halo! Ada yang bisa saya bantu?' : 'Hello! How can I help you?',
    autoOpen: false,
    responseDelay: 1,
    showTimestamp: true,
    allowFileUpload: false,
    mobileOptimized: true
  })

  const [apiKey, setApiKey] = useState('embed_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

  // Generate embed code when settings change
  useEffect(() => {
    generateEmbedCode()
  }, [widgetSettings, apiKey])

  const generateEmbedCode = () => {
    const config = {
      apiKey: apiKey,
      position: widgetSettings.position,
      theme: widgetSettings.theme,
      primaryColor: widgetSettings.primaryColor,
      backgroundColor: widgetSettings.backgroundColor,
      textColor: widgetSettings.textColor,
      welcomeMessage: widgetSettings.welcomeMessage,
      autoOpen: widgetSettings.autoOpen,
      responseDelay: widgetSettings.responseDelay,
      showTimestamp: widgetSettings.showTimestamp,
      allowFileUpload: widgetSettings.allowFileUpload,
      mobileOptimized: widgetSettings.mobileOptimized
    }

    const code = `<!-- Attalah AI Chat Widget -->
<script>
  window.AttalahChatConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://cdn.attalah.ai/chat-widget.js" async></script>
<!-- End Attalah AI Chat Widget -->`

    setEmbedCode(code)
  }

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode)
  }

  const handleGenerateApiKey = () => {
    const newApiKey = 'embed_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setApiKey(newApiKey)
  }

  const handleAddDomain = () => {
    if (newDomain.trim() && !domains.includes(newDomain.trim())) {
      setDomains([...domains, newDomain.trim()])
      setNewDomain('')
    }
  }

  const handleRemoveDomain = (domain: string) => {
    setDomains(domains.filter(d => d !== domain))
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('integrations.embedChat.title')}</h1>
          <p className="text-muted-foreground">
            {t('integrations.embedChat.description')}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          {t('integrations.embedChat.status.active')}
        </Badge>
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.embedChat.stats.totalEmbeds')}
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmbeds}</div>
            <p className="text-xs text-muted-foreground">
              {activeWidgets.length} {t('integrations.embedChat.overview.activeWidgets').toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.embedChat.stats.activeChats')}
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChats}</div>
            <p className="text-xs text-muted-foreground">
              {stats.messagesToday} {t('integrations.embedChat.stats.messagesToday').toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.embedChat.stats.conversionRate')}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.embedChat.analytics.totalViews')}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalInteractions} interaksi
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {t('integrations.embedChat.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t('integrations.embedChat.tabs.customize')}
          </TabsTrigger>
          <TabsTrigger value="install" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            {t('integrations.embedChat.tabs.install')}
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t('integrations.embedChat.tabs.api')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {t('integrations.embedChat.tabs.analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Active Widgets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {t('integrations.embedChat.overview.activeWidgets')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.embedChat.overview.activeWidgetsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(widget.status)}
                        <div>
                          <p className="font-medium">{widget.name}</p>
                          <p className="text-sm text-muted-foreground">{widget.domain}</p>
                          <p className="text-xs text-muted-foreground">
                            {widget.messages} messages • {widget.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('integrations.embedChat.overview.addWidget')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('integrations.embedChat.overview.recentActivity')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.embedChat.overview.recentActivityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New widget installed on blog.example.com</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Configuration updated for Main Website Widget</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">API key regenerated for security</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('integrations.embedChat.overview.performance')}
              </CardTitle>
              <CardDescription>
                {t('integrations.embedChat.overview.performanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.avgSessionDuration}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('integrations.embedChat.analytics.avgSessionDuration')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.bounceRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('integrations.embedChat.analytics.bounceRate')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalInteractions}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('integrations.embedChat.analytics.totalInteractions')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    89%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Satisfaction Rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {t('integrations.embedChat.customize.appearance')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.embedChat.customize.appearanceDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('integrations.embedChat.customize.position')}</Label>
                  <Select
                    value={widgetSettings.position}
                    onValueChange={(value) => setWidgetSettings({ ...widgetSettings, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottomRight">
                        {t('integrations.embedChat.customize.position.bottomRight')}
                      </SelectItem>
                      <SelectItem value="bottomLeft">
                        {t('integrations.embedChat.customize.position.bottomLeft')}
                      </SelectItem>
                      <SelectItem value="custom">
                        {t('integrations.embedChat.customize.position.custom')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.embedChat.customize.theme')}</Label>
                  <Select
                    value={widgetSettings.theme}
                    onValueChange={(value) => setWidgetSettings({ ...widgetSettings, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        {t('integrations.embedChat.customize.theme.light')}
                      </SelectItem>
                      <SelectItem value="dark">
                        {t('integrations.embedChat.customize.theme.dark')}
                      </SelectItem>
                      <SelectItem value="auto">
                        {t('integrations.embedChat.customize.theme.auto')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.embedChat.customize.primaryColor')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={widgetSettings.primaryColor}
                      onChange={(e) => setWidgetSettings({ ...widgetSettings, primaryColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={widgetSettings.primaryColor}
                      onChange={(e) => setWidgetSettings({ ...widgetSettings, primaryColor: e.target.value })}
                      placeholder="#10b981"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.embedChat.customize.backgroundColor')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={widgetSettings.backgroundColor}
                      onChange={(e) => setWidgetSettings({ ...widgetSettings, backgroundColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={widgetSettings.backgroundColor}
                      onChange={(e) => setWidgetSettings({ ...widgetSettings, backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.embedChat.customize.textColor')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={widgetSettings.textColor}
                      onChange={(e) => setWidgetSettings({ ...widgetSettings, textColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={widgetSettings.textColor}
                      onChange={(e) => setWidgetSettings({ ...widgetSettings, textColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Behavior Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('integrations.embedChat.customize.behavior')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.embedChat.customize.behaviorDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoOpen">
                    {t('integrations.embedChat.customize.autoOpen')}
                  </Label>
                  <Switch
                    id="autoOpen"
                    checked={widgetSettings.autoOpen}
                    onCheckedChange={(checked) => setWidgetSettings({ ...widgetSettings, autoOpen: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">
                    {t('integrations.embedChat.customize.welcomeMessage')}
                  </Label>
                  <Textarea
                    id="welcomeMessage"
                    value={widgetSettings.welcomeMessage}
                    onChange={(e) => setWidgetSettings({ ...widgetSettings, welcomeMessage: e.target.value })}
                    placeholder={t('integrations.embedChat.customize.welcomePlaceholder')}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responseDelay">
                    {t('integrations.embedChat.customize.responseDelay')}
                  </Label>
                  <Input
                    id="responseDelay"
                    type="number"
                    value={widgetSettings.responseDelay}
                    onChange={(e) => setWidgetSettings({ ...widgetSettings, responseDelay: parseInt(e.target.value) })}
                    min="0"
                    max="10"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showTimestamp">
                    {t('integrations.embedChat.customize.showTimestamp')}
                  </Label>
                  <Switch
                    id="showTimestamp"
                    checked={widgetSettings.showTimestamp}
                    onCheckedChange={(checked) => setWidgetSettings({ ...widgetSettings, showTimestamp: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowFileUpload">
                    {t('integrations.embedChat.customize.allowFileUpload')}
                  </Label>
                  <Switch
                    id="allowFileUpload"
                    checked={widgetSettings.allowFileUpload}
                    onCheckedChange={(checked) => setWidgetSettings({ ...widgetSettings, allowFileUpload: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mobileOptimized">
                    {t('integrations.embedChat.customize.mobileOptimized')}
                  </Label>
                  <Switch
                    id="mobileOptimized"
                    checked={widgetSettings.mobileOptimized}
                    onCheckedChange={(checked) => setWidgetSettings({ ...widgetSettings, mobileOptimized: checked })}
                  />
                </div>

                <Button className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Preview Changes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {t('integrations.embedChat.install.preview')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  {t('integrations.embedChat.install.desktop')}
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  {t('integrations.embedChat.install.mobile')}
                </Button>
              </div>

              <div className={`border rounded-lg p-4 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                {/* Mock website preview with embedded chat */}
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] relative">
                  <div className="text-center text-gray-500">
                    <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Website Preview</p>
                  </div>

                  {/* Mock chat widget */}
                  <div
                    className={`absolute bg-white rounded-lg shadow-lg border-2 ${widgetSettings.position === 'bottomRight' ? 'bottom-4 right-4' : 'bottom-4 left-4'}`}
                    style={{
                      width: previewMode === 'mobile' ? '280px' : '350px',
                      borderColor: widgetSettings.primaryColor
                    }}
                  >
                    <div
                      className="p-3 text-white rounded-t-lg"
                      style={{ backgroundColor: widgetSettings.primaryColor }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">AI Assistant</span>
                        <MessageCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-3" style={{ backgroundColor: widgetSettings.backgroundColor }}>
                      <p style={{ color: widgetSettings.textColor }} className="text-sm">
                        {widgetSettings.welcomeMessage}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-2 py-1 border rounded text-sm"
                          style={{ borderColor: widgetSettings.primaryColor }}
                        />
                        <button
                          className="px-3 py-1 text-white rounded text-sm"
                          style={{ backgroundColor: widgetSettings.primaryColor }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="install" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {t('integrations.embedChat.install.copyCode')}
              </CardTitle>
              <CardDescription>
                {t('integrations.embedChat.install.embedInstructions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('integrations.embedChat.install.step1')}</Label>
                <div className="relative">
                  <Textarea
                    value={embedCode}
                    readOnly
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleCopyEmbedCode}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {t('integrations.embedChat.install.copyCode')}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">{t('integrations.embedChat.install.step2')}</h4>
                    <p className="text-sm text-muted-foreground">
                      Tempel kode tersebut di HTML website Anda sebelum tag &lt;/body&gt;
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">{t('integrations.embedChat.install.step3')}</h4>
                    <p className="text-sm text-muted-foreground">
                      Simpan perubahan dan refresh halaman website Anda
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  {t('integrations.embedChat.install.testEmbed')}
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download as HTML
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                {t('integrations.embedChat.api.title')}
              </CardTitle>
              <CardDescription>
                {t('integrations.embedChat.api.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.embedChat.api.apiKeys')}</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Embed API Key</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyApiKey}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateApiKey}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleGenerateApiKey} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('integrations.embedChat.api.generateNewKey')}
                </Button>
              </div>

              {/* Domain Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.embedChat.api.domains')}</h3>

                <div className="space-y-2">
                  {domains.map((domain) => (
                    <div key={domain} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{domain}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDomain(domain)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                  />
                  <Button onClick={handleAddDomain}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('integrations.embedChat.api.addDomain')}
                  </Button>
                </div>
              </div>

              {/* Rate Limiting */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.embedChat.api.rateLimit')}</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('integrations.embedChat.api.requestsPerDay')}</Label>
                    <Input
                      type="number"
                      defaultValue="10000"
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Requests per Hour</Label>
                    <Input
                      type="number"
                      defaultValue="500"
                      placeholder="500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Engagement Metrics
                </CardTitle>
                <CardDescription>
                  {t('integrations.embedChat.analytics.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('integrations.embedChat.analytics.totalViews')}
                    </span>
                    <span className="text-sm font-bold">{stats.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('integrations.embedChat.analytics.totalInteractions')}
                    </span>
                    <span className="text-sm font-bold">{stats.totalInteractions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('integrations.embedChat.analytics.avgSessionDuration')}
                    </span>
                    <span className="text-sm font-bold">{stats.avgSessionDuration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {t('integrations.embedChat.analytics.bounceRate')}
                    </span>
                    <span className="text-sm font-bold">{stats.bounceRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('integrations.embedChat.analytics.topPages')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">/home</span>
                    <span className="text-sm font-bold">1,234 views</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">/products</span>
                    <span className="text-sm font-bold">892 views</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">/contact</span>
                    <span className="text-sm font-bold">567 views</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">/blog</span>
                    <span className="text-sm font-bold">445 views</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {t('integrations.embedChat.analytics.deviceTypes')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">65%</div>
                  <p className="text-sm text-muted-foreground">Desktop</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">30%</div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5%</div>
                  <p className="text-sm text-muted-foreground">Tablet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {t('integrations.embedChat.analytics.popularQuestions')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">What are your pricing plans?</span>
                  <span className="text-sm font-bold">45 times</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">How do I get started?</span>
                  <span className="text-sm font-bold">38 times</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">Do you offer support?</span>
                  <span className="text-sm font-bold">32 times</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="text-sm">What's your refund policy?</span>
                  <span className="text-sm font-bold">28 times</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}