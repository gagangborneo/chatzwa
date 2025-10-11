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
import { Progress } from '@/components/ui/progress'
import {
  WordPress,
  Key,
  BarChart3,
  Download,
  Upload,
  Settings,
  Globe,
  FileText,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Link,
  Unlink,
  Play,
  Pause,
  Database,
  Server,
  Code,
  Book,
  Video,
  ExternalLink
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function WordPressIntegration() {
  const { t, language } = useI18n()
  const [activeTab, setActiveTab] = useState('overview')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [formData, setFormData] = useState({
    siteUrl: '',
    apiKey: '',
    siteName: '',
    autoSync: true,
    syncInterval: 'hourly'
  })

  // Mock WordPress statistics
  const [stats, setStats] = useState({
    totalPosts: 1234,
    totalPages: 89,
    syncedPosts: 1156,
    syncedPages: 85,
    lastSync: new Date(),
    syncStatus: 'success',
    storageUsed: 45.6,
    storageLimit: 100,
    activeUsers: 234,
    monthlyViews: 12580
  })

  const mockSites = [
    {
      id: '1',
      name: 'Company Blog',
      url: 'https://blog.company.com',
      status: 'connected',
      lastSync: new Date(),
      posts: 856,
      pages: 42,
      storageUsed: 23.4
    },
    {
      id: '2',
      name: 'News Portal',
      url: 'https://news.example.com',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 86400000),
      posts: 378,
      pages: 47,
      storageUsed: 22.2
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
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const handleConnectWordPress = async () => {
    setIsConnecting(true)
    setIsConnected('connecting')

    // Simulate connection process
    setTimeout(() => {
      setIsConnected('connected')
      setIsConnecting(false)
      setStats({
        ...stats,
        lastSync: new Date(),
        syncStatus: 'success'
      })
    }, 2000)
  }

  const handleDisconnectWordPress = () => {
    setIsConnected('disconnected')
    setFormData({
      siteUrl: '',
      apiKey: '',
      siteName: '',
      autoSync: true,
      syncInterval: 'hourly'
    })
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(formData.apiKey)
  }

  const handleGenerateApiKey = () => {
    const newApiKey = `wp_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setFormData({ ...formData, apiKey: newApiKey })
  }

  const handleSyncNow = () => {
    setStats({
      ...stats,
      lastSync: new Date(),
      syncStatus: 'syncing'
    })

    setTimeout(() => {
      setStats({
        ...stats,
        syncedPosts: stats.totalPosts,
        syncedPages: stats.totalPages,
        syncStatus: 'success'
      })
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('integrations.wordpress.title')}</h1>
          <p className="text-muted-foreground">
            {t('integrations.wordpress.description')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(isConnected)}`} />
            {t(`integrations.wordpress.status.${isConnected}`)}
          </Badge>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.wordpress.stats.totalPosts')}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.syncedPosts} {t('integrations.wordpress.stats.synced')}
            </p>
            <Progress value={(stats.syncedPosts / stats.totalPosts) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.wordpress.stats.totalPages')}
            </CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.syncedPages} {t('integrations.wordpress.stats.synced')}
            </p>
            <Progress value={(stats.syncedPages / stats.totalPages) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.wordpress.stats.storage')}
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storageUsed} GB</div>
            <p className="text-xs text-muted-foreground">
              {t('integrations.wordpress.stats.ofLimit', { limit: stats.storageLimit })}
            </p>
            <Progress value={(stats.storageUsed / stats.storageLimit) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('integrations.wordpress.stats.lastSync')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.lastSync.toLocaleDateString()}
            </p>
            <Badge variant={stats.syncStatus === 'success' ? 'default' : 'secondary'} className="mt-2">
              {t(`integrations.wordpress.syncStatus.${stats.syncStatus}`)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {t('integrations.wordpress.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="connection" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            {t('integrations.wordpress.tabs.connection')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t('integrations.wordpress.tabs.settings')}
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            {t('integrations.wordpress.tabs.api')}
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <Book className="w-4 h-4" />
            {t('integrations.wordpress.tabs.guide')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Connected Sites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('integrations.wordpress.overview.connectedSites')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.wordpress.overview.connectedSitesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSites.map((site) => (
                    <div
                      key={site.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(site.status)}
                        <div>
                          <p className="font-medium">{site.name}</p>
                          <p className="text-sm text-muted-foreground">{site.url}</p>
                          <p className="text-xs text-muted-foreground">
                            {site.posts} posts, {site.pages} pages, {site.storageUsed} GB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          {site.status === 'connected' ? (
                            <Unlink className="w-4 h-4" />
                          ) : (
                            <Link className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('integrations.wordpress.overview.addSite')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sync Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('integrations.wordpress.overview.syncActivity')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.wordpress.overview.syncActivityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {t('integrations.wordpress.overview.autoSync')}
                    </span>
                    <Switch checked={formData.autoSync} />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('integrations.wordpress.overview.syncInterval')}</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={formData.syncInterval}
                      onChange={(e) => setFormData({ ...formData, syncInterval: e.target.value })}
                    >
                      <option value="realtime">{t('integrations.wordpress.settings.realtime')}</option>
                      <option value="hourly">{t('integrations.wordpress.settings.hourly')}</option>
                      <option value="daily">{t('integrations.wordpress.settings.daily')}</option>
                      <option value="weekly">{t('integrations.wordpress.settings.weekly')}</option>
                    </select>
                  </div>

                  <Button onClick={handleSyncNow} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('integrations.wordpress.overview.syncNow')}
                  </Button>

                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">
                      {t('integrations.wordpress.overview.nextSync')}: {stats.lastSync.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t('integrations.wordpress.overview.performance')}
              </CardTitle>
              <CardDescription>
                {t('integrations.wordpress.overview.performanceDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(stats.syncedPosts / stats.totalPosts * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('integrations.wordpress.overview.syncCompletion')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.activeUsers.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('integrations.wordpress.overview.activeUsers')}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.monthlyViews.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('integrations.wordpress.overview.monthlyViews')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connection" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Site Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  {t('integrations.wordpress.connection.setup')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.wordpress.connection.setupDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">{t('integrations.wordpress.connection.siteUrl')}</Label>
                  <Input
                    id="siteUrl"
                    value={formData.siteUrl}
                    onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                    placeholder="https://yoursite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteName">{t('integrations.wordpress.connection.siteName')}</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    placeholder={t('integrations.wordpress.connection.siteNamePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">{t('integrations.wordpress.connection.apiKey')}</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      placeholder={t('integrations.wordpress.connection.apiKeyPlaceholder')}
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

                <div className="flex gap-2">
                  {isConnected === 'connected' ? (
                    <Button onClick={handleDisconnectWordPress} variant="destructive" className="flex-1">
                      <Unlink className="w-4 h-4 mr-2" />
                      {t('integrations.wordpress.connection.disconnect')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleConnectWordPress}
                      disabled={isConnecting || !formData.siteUrl || !formData.apiKey}
                      className="flex-1"
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          {t('integrations.wordpress.connection.connecting')}
                        </>
                      ) : (
                        <>
                          <Link className="w-4 h-4 mr-2" />
                          {t('integrations.wordpress.connection.connect')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  {t('integrations.wordpress.connection.status')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.wordpress.connection.statusDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      {t('integrations.wordpress.connection.apiConnection')}
                    </span>
                    {getStatusIcon(isConnected)}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      {t('integrations.wordpress.connection.syncStatus')}
                    </span>
                    <Badge variant={stats.syncStatus === 'success' ? 'default' : 'secondary'}>
                      {t(`integrations.wordpress.syncStatus.${stats.syncStatus}`)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      {t('integrations.wordpress.connection.lastSync')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {stats.lastSync.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">
                      {t('integrations.wordpress.connection.dataIntegrity')}
                    </span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('integrations.wordpress.connection.test')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline">
                  <Play className="w-4 h-4 mr-2" />
                  {t('integrations.wordpress.connection.testApi')}
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('integrations.wordpress.connection.testSync')}
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('integrations.wordpress.connection.testExport')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Sync Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('integrations.wordpress.settings.sync')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.wordpress.settings.syncDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSync">{t('integrations.wordpress.settings.autoSync')}</Label>
                  <Switch
                    id="autoSync"
                    checked={formData.autoSync}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoSync: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.wordpress.settings.syncInterval')}</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.syncInterval}
                    onChange={(e) => setFormData({ ...formData, syncInterval: e.target.value })}
                  >
                    <option value="realtime">{t('integrations.wordpress.settings.realtime')}</option>
                    <option value="hourly">{t('integrations.wordpress.settings.hourly')}</option>
                    <option value="daily">{t('integrations.wordpress.settings.daily')}</option>
                    <option value="weekly">{t('integrations.wordpress.settings.weekly')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.wordpress.settings.contentType')}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="posts" defaultChecked />
                      <Label htmlFor="posts">{t('integrations.wordpress.settings.posts')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="pages" defaultChecked />
                      <Label htmlFor="pages">{t('integrations.wordpress.settings.pages')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="media" />
                      <Label htmlFor="media">{t('integrations.wordpress.settings.media')}</Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('integrations.wordpress.settings.saveSettings')}
                </Button>
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  {t('integrations.wordpress.settings.advanced')}
                </CardTitle>
                <CardDescription>
                  {t('integrations.wordpress.settings.advancedDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('integrations.wordpress.settings.batchSize')}</Label>
                  <Input
                    type="number"
                    defaultValue="50"
                    placeholder={t('integrations.wordpress.settings.batchSizePlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t('integrations.wordpress.settings.timeout')}</Label>
                  <Input
                    type="number"
                    defaultValue="30"
                    placeholder={t('integrations.wordpress.settings.timeoutPlaceholder')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('integrations.wordpress.settings.retryFailed')}</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('integrations.wordpress.settings.enableLogging')}</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t('integrations.wordpress.settings.optimizeImages')}</Label>
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
                {t('integrations.wordpress.api.title')}
              </CardTitle>
              <CardDescription>
                {t('integrations.wordpress.api.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Management */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.api.apiKeys')}</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">WordPress API Key</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.apiKey || 'wp_example_key_1234567890'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                  {t('integrations.wordpress.api.generateNewKey')}
                </Button>
              </div>

              {/* API Endpoints */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.api.endpoints')}</h3>

                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Get Posts</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      GET /api/wordpress/posts
                    </code>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Sync Posts</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      POST /api/wordpress/sync
                    </code>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">Get Statistics</p>
                    <code className="text-sm bg-muted p-2 rounded block">
                      GET /api/wordpress/stats
                    </code>
                  </div>
                </div>
              </div>

              {/* API Documentation */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.api.documentation')}</h3>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    {t('integrations.wordpress.api.downloadDocs')}
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('integrations.wordpress.api.viewOnline')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                {t('integrations.wordpress.guide.title')}
              </CardTitle>
              <CardDescription>
                {t('integrations.wordpress.guide.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Installation Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.guide.installation')}</h3>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">{t('integrations.wordpress.guide.step1Title')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('integrations.wordpress.guide.step1Description')}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="w-4 h-4 mr-2" />
                        {t('integrations.wordpress.guide.downloadPlugin')}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">{t('integrations.wordpress.guide.step2Title')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('integrations.wordpress.guide.step2Description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">{t('integrations.wordpress.guide.step3Title')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('integrations.wordpress.guide.step3Description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">{t('integrations.wordpress.guide.step4Title')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('integrations.wordpress.guide.step4Description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      5
                    </div>
                    <div>
                      <h4 className="font-medium">{t('integrations.wordpress.guide.step5Title')}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('integrations.wordpress.guide.step5Description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Tutorial */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.guide.videoTutorial')}</h3>
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {t('integrations.wordpress.guide.videoPlaceholder')}
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Play className="w-4 h-4 mr-2" />
                    {t('integrations.wordpress.guide.watchVideo')}
                  </Button>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.guide.requirements')}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('integrations.wordpress.guide.wordpressRequirements')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• WordPress 5.0 or higher</li>
                      <li>• PHP 7.4 or higher</li>
                      <li>• MySQL 5.6 or higher</li>
                      <li>• SSL certificate (recommended)</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('integrations.wordpress.guide.serverRequirements')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• REST API enabled</li>
                      <li>• JSON API support</li>
                      <li>• File upload permissions</li>
                      <li>• Outbound HTTP requests</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('integrations.wordpress.guide.troubleshooting')}</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('integrations.wordpress.guide.troubleTitle1')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('integrations.wordpress.guide.troubleSolution1')}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('integrations.wordpress.guide.troubleTitle2')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('integrations.wordpress.guide.troubleSolution2')}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{t('integrations.wordpress.guide.troubleTitle3')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('integrations.wordpress.guide.troubleSolution3')}
                    </p>
                  </div>
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
import { Plus } from 'lucide-react'