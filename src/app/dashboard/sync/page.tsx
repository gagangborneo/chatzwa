'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  RefreshCw,
  Database,
  FileText,
  Upload,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Activity,
  BarChart3,
  BookOpen,
  Zap,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Globe,
  Server,
  Shield
} from 'lucide-react'

export default function DataSyncPage() {
  const { t } = useI18n()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [selectedDataSource, setSelectedDataSource] = useState('all')
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)

  // Mock data untuk demonstrasi
  const syncStats = {
    totalDocuments: 1247,
    syncedDocuments: 1189,
    embeddingsGenerated: 45832,
    lastSync: '2 jam yang lalu',
    nextSync: '30 menit lagi',
    storageUsed: 2.4,
    storageTotal: 5.0
  }

  const dataSources = [
    {
      id: 'database',
      name: 'Database Internal',
      type: 'database',
      status: 'connected',
      lastSync: '5 menit yang lalu',
      records: 1247,
      size: '2.4 GB'
    },
    {
      id: 'wordpress',
      name: 'WordPress Website',
      type: 'cms',
      status: 'connected',
      lastSync: '1 jam yang lalu',
      records: 456,
      size: '890 MB'
    },
    {
      id: 'documents',
      name: 'Document Repository',
      type: 'files',
      status: 'connected',
      lastSync: '30 menit yang lalu',
      records: 789,
      size: '1.2 GB'
    },
    {
      id: 'api',
      name: 'External API',
      type: 'api',
      status: 'disconnected',
      lastSync: '2 hari yang lalu',
      records: 0,
      size: '0 MB'
    }
  ]

  const recentSyncs = [
    {
      id: '1',
      source: 'Database Internal',
      type: 'full_sync',
      status: 'completed',
      startTime: '2024-01-15 10:30:00',
      endTime: '2024-01-15 10:32:15',
      documentsProcessed: 1247,
      embeddingsGenerated: 45832,
      errors: 0
    },
    {
      id: '2',
      source: 'WordPress Website',
      type: 'incremental',
      status: 'completed',
      startTime: '2024-01-15 09:15:00',
      endTime: '2024-01-15 09:16:30',
      documentsProcessed: 23,
      embeddingsGenerated: 892,
      errors: 0
    },
    {
      id: '3',
      source: 'Document Repository',
      type: 'incremental',
      status: 'failed',
      startTime: '2024-01-15 08:45:00',
      endTime: '2024-01-15 08:47:22',
      documentsProcessed: 156,
      embeddingsGenerated: 0,
      errors: 3
    },
    {
      id: '4',
      source: 'External API',
      type: 'full_sync',
      status: 'running',
      startTime: '2024-01-15 11:00:00',
      endTime: null,
      documentsProcessed: 45,
      embeddingsGenerated: 0,
      errors: 0
    }
  ]

  const embeddingModels = [
    {
      name: 'text-embedding-ada-002',
      provider: 'OpenAI',
      status: 'active',
      dimensions: 1536,
      usage: 45832,
      cost: '$12.47'
    },
    {
      name: 'bge-large-en-v1.5',
      provider: 'BGE',
      status: 'inactive',
      dimensions: 1024,
      usage: 0,
      cost: '$0.00'
    },
    {
      name: 'sentence-transformers',
      provider: 'Hugging Face',
      status: 'inactive',
      dimensions: 768,
      usage: 0,
      cost: '$0.00'
    }
  ]

  const handleManualSync = () => {
    setIsSyncing(true)
    setSyncProgress(0)

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 500)

    setTimeout(() => {
      setSyncProgress(100)
      setTimeout(() => {
        setIsSyncing(false)
        setSyncProgress(0)
      }, 1000)
    }, 5000)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'connected': return 'bg-green-100 text-green-800'
      case 'disconnected': return 'bg-red-100 text-red-800'
      case 'syncing': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />
      case 'disconnected': return <XCircle className="h-4 w-4" />
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'inactive': return <Pause className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <XCircle className="h-4 w-4" />
      case 'running': return <Activity className="h-4 w-4 animate-pulse" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Running...'

    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const duration = Math.round((end - start) / 1000)

    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.round(duration / 60)}m ${duration % 60}s`
    return `${Math.round(duration / 3600)}h ${Math.round((duration % 3600) / 60)}m`
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('nav.dataSync')}
          </h2>
          <p className="text-muted-foreground">
            {t('sync.subtitle', 'Manage RAG data synchronization and embedding generation')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sync.allSources')}</SelectItem>
                {dataSources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>{source.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleManualSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {t('sync.syncing')}...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('sync.manualSync')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sync Progress */}
      {isSyncing && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>{t('sync.syncInProgress')}</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Sync Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sync.totalDocuments')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.totalDocuments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('sync.lastSync')}: {syncStats.lastSync}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sync.syncedDocuments')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.syncedDocuments.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(syncStats.syncedDocuments / syncStats.totalDocuments) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round((syncStats.syncedDocuments / syncStats.totalDocuments) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sync.embeddings')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.embeddingsGenerated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('sync.vectorEmbeddings')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sync.storage')}</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.storageUsed} GB</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={(syncStats.storageUsed / syncStats.storageTotal) * 100} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {syncStats.storageUsed}/{syncStats.storageTotal} GB
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Tabs */}
      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sources">{t('sync.tabs.sources')}</TabsTrigger>
          <TabsTrigger value="history">{t('sync.tabs.history')}</TabsTrigger>
          <TabsTrigger value="embeddings">{t('sync.tabs.embeddings')}</TabsTrigger>
          <TabsTrigger value="settings">{t('sync.tabs.settings')}</TabsTrigger>
        </TabsList>

        {/* Data Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('sync.dataSources')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('sync.source')}</TableHead>
                    <TableHead>{t('sync.type')}</TableHead>
                    <TableHead>{t('sync.status')}</TableHead>
                    <TableHead>{t('sync.lastSync')}</TableHead>
                    <TableHead>{t('sync.records')}</TableHead>
                    <TableHead>{t('sync.size')}</TableHead>
                    <TableHead>{t('sync.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSources.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{source.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(source.status)}
                          <Badge className={getStatusColor(source.status)}>
                            {t(`sync.status.${source.status}`)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{source.lastSync}</TableCell>
                      <TableCell>{source.records.toLocaleString()}</TableCell>
                      <TableCell>{source.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            {source.status === 'connected' ? (
                              <>
                                <RefreshCw className="h-3 w-3" />
                                {t('sync.sync')}
                              </>
                            ) : (
                              <>
                                <Settings className="h-3 w-3" />
                                {t('sync.configure')}
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('sync.syncHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('sync.source')}</TableHead>
                    <TableHead>{t('sync.type')}</TableHead>
                    <TableHead>{t('sync.status')}</TableHead>
                    <TableHead>{t('sync.duration')}</TableHead>
                    <TableHead>{t('sync.documents')}</TableHead>
                    <TableHead>{t('sync.embeddings')}</TableHead>
                    <TableHead>{t('sync.errors')}</TableHead>
                    <TableHead>{t('sync.time')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSyncs.map((sync) => (
                    <TableRow key={sync.id}>
                      <TableCell className="font-medium">{sync.source}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`sync.type.${sync.type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sync.status)}
                          <Badge className={getStatusColor(sync.status)}>
                            {t(`sync.status.${sync.status}`)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(sync.startTime, sync.endTime)}</TableCell>
                      <TableCell>{sync.documentsProcessed.toLocaleString()}</TableCell>
                      <TableCell>{sync.embeddingsGenerated.toLocaleString()}</TableCell>
                      <TableCell>
                        {sync.errors > 0 ? (
                          <Badge variant="destructive">{sync.errors}</Badge>
                        ) : (
                          <Badge variant="secondary">0</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(sync.startTime).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {new Date(sync.startTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Embeddings Tab */}
        <TabsContent value="embeddings" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('sync.embeddingModels')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {embeddingModels.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          model.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div>
                          <h4 className="font-medium">{model.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {model.provider} • {model.dimensions} dimensions
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{model.cost}</div>
                        <div className="text-sm text-muted-foreground">
                          {model.usage.toLocaleString()} {t('sync.embeddings')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('sync.embeddingStats')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('sync.totalEmbeddings')}</span>
                    <span className="text-sm">45,832</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div className="h-2 w-3/4 bg-blue-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('sync.embeddingAccuracy')}</span>
                    <span className="text-sm">94.2%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div className="h-2 w-[94.2%] bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('sync.retrievalLatency')}</span>
                    <span className="text-sm">120ms</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full">
                    <div className="h-2 w-1/3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    {t('sync.optimizeEmbeddings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('sync.autoSync')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{t('sync.enableAutoSync')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('sync.autoSyncDescription')}
                    </p>
                  </div>
                  <Switch checked={autoSyncEnabled} onCheckedChange={setAutoSyncEnabled} />
                </div>

                {autoSyncEnabled && (
                  <div className="space-y-4 pl-4 border-l-2 border-muted">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('sync.syncInterval')}</label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 {t('sync.minutes')}</SelectItem>
                          <SelectItem value="30">30 {t('sync.minutes')}</SelectItem>
                          <SelectItem value="60">1 {t('sync.hour')}</SelectItem>
                          <SelectItem value="240">4 {t('sync.hours')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('sync.syncType')}</label>
                      <Select defaultValue="incremental">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="incremental">{t('sync.type.incremental')}</SelectItem>
                          <SelectItem value="full">{t('sync.type.full_sync')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('sync.advancedSettings')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('sync.chunkSize')}</label>
                  <Input type="number" defaultValue="1000" />
                  <p className="text-xs text-muted-foreground">
                    {t('sync.chunkSizeDescription')}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('sync.overlap')}</label>
                  <Input type="number" defaultValue="200" />
                  <p className="text-xs text-muted-foreground">
                    {t('sync.overlapDescription')}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('sync.batchSize')}</label>
                  <Input type="number" defaultValue="100" />
                  <p className="text-xs text-muted-foreground">
                    {t('sync.batchSizeDescription')}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t('sync.resetSettings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}