'use client'

import { useState, useEffect } from 'react'
import { usePathname, useParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import {
  BarChart3,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Zap,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface AnalyticsData {
  overview: {
    totalConversations: number
    totalMessages: number
    activeUsers: number
    avgResponseTime: number
    satisfactionRate: number
    totalTokensUsed: number
  }
  conversationsByDay: Array<{
    date: string
    conversations: number
    messages: number
  }>
  topQuestions: Array<{
    question: string
    count: number
    satisfaction: number
  }>
  performanceMetrics: {
    avgResponseTime: number
    successRate: number
    fallbackRate: number
    tokenUsage: number
  }
  userEngagement: {
    newUsers: number
    returningUsers: number
    avgSessionDuration: number
    bounceRate: number
  }
}

export default function AnalyticsPage() {
  const pathname = usePathname()
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [refreshing, setRefreshing] = useState(false)

  // Extract chatbot ID from pathname
  const chatbotId = pathname.split('/')[3] || ''

  useEffect(() => {
    loadAnalyticsData()
  }, [chatbotId, timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!chatbotId) {
        throw new Error('Chatbot ID tidak ditemukan')
      }

      // Mock data untuk sekarang, nanti diganti dengan API call
      const mockData: AnalyticsData = {
        overview: {
          totalConversations: 1247,
          totalMessages: 3841,
          activeUsers: 892,
          avgResponseTime: 1.2,
          satisfactionRate: 87.3,
          totalTokensUsed: 125420,
        },
        conversationsByDay: [
          { date: '2024-01-15', conversations: 145, messages: 423 },
          { date: '2024-01-16', conversations: 178, messages: 567 },
          { date: '2024-01-17', conversations: 156, messages: 489 },
          { date: '2024-01-18', conversations: 189, messages: 612 },
          { date: '2024-01-19', conversations: 167, messages: 534 },
          { date: '2024-01-20', conversations: 198, messages: 645 },
          { date: '2024-01-21', conversations: 214, messages: 571 },
        ],
        topQuestions: [
          { question: 'Bagaimana cara mendaftar?', count: 234, satisfaction: 92 },
          { question: 'Berapa biaya layanan?', count: 189, satisfaction: 88 },
          { question: 'Apakah ada gratisan?', count: 156, satisfaction: 85 },
          { question: 'Bagaimana cara kerjanya?', count: 143, satisfaction: 90 },
          { question: 'Dimana lokasi kantor?', count: 127, satisfaction: 94 },
        ],
        performanceMetrics: {
          avgResponseTime: 1.2,
          successRate: 94.7,
          fallbackRate: 5.3,
          tokenUsage: 125420,
        },
        userEngagement: {
          newUsers: 234,
          returningUsers: 658,
          avgSessionDuration: 4.8,
          bounceRate: 23.5,
        },
      }

      // Simulasi delay loading
      await new Promise(resolve => setTimeout(resolve, 1000))

      setAnalyticsData(mockData)
    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError('Gagal memuat data analytics. ' + (err instanceof Error ? err.message : 'Terjadi kesalahan'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
  }

  const handleExport = () => {
    // Export functionality
    console.log('Exporting analytics data...')
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Monitor performa dan statistik chatbot</p>
          </div>
          <Skeleton className="h-10 w-[120px]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-3 w-[80px] mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[60px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 p-4 border border-red-200 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="font-medium text-red-900">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Monitor performa dan statistik chatbot</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih rentang waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Jam Terakhir</SelectItem>
              <SelectItem value="7d">7 Hari Terakhir</SelectItem>
              <SelectItem value="30d">30 Hari Terakhir</SelectItem>
              <SelectItem value="90d">90 Hari Terakhir</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Percakapan</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalConversations.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> dari periode sebelumnya
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalMessages.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> dari periode sebelumnya
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> dari periode sebelumnya
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Kepuasan</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.satisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> dari periode sebelumnya
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversations Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Percakapan</CardTitle>
            <CardDescription>Jumlah percakapan dan pesan per hari</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.conversationsByDay.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{day.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{day.conversations} percakapan</div>
                      <div className="text-xs text-muted-foreground">{day.messages} pesan</div>
                    </div>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(day.conversations / Math.max(...analyticsData.conversationsByDay.map(d => d.conversations))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Terpopuler</CardTitle>
            <CardDescription>Pertanyaan yang paling sering diajukan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topQuestions.map((question, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium truncate max-w-[200px]" title={question.question}>
                      {question.question}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{question.count} kali</span>
                      <Badge variant="secondary" className="text-xs">
                        {question.satisfaction}% puas
                      </Badge>
                    </div>
                  </div>
                  <div className="w-16 bg-muted rounded-full h-2 ml-4">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(question.count / analyticsData.topQuestions[0].count) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Metrik Performa</CardTitle>
            <CardDescription>Statistik performa chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Waktu Respons Rata-rata</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.performanceMetrics.avgResponseTime}s</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tingkat Keberhasilan</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.performanceMetrics.successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tingkat Fallback</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.performanceMetrics.fallbackRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Penggunaan Token</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.performanceMetrics.tokenUsage.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>Keterlibatan Pengguna</CardTitle>
            <CardDescription>Statistik keterlibatan pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Pengguna Baru</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.userEngagement.newUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Pengguna Kembali</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.userEngagement.returningUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Durasi Sesi Rata-rata</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.userEngagement.avgSessionDuration} menit</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Bounce Rate</span>
                </div>
                <span className="text-sm font-bold">{analyticsData.userEngagement.bounceRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}