'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import StatsCards, { DetailedStats } from '@/components/dashboard/stats-cards'
import { ChatVolumeChart, TokenUsageChart, PerformanceChart } from '@/components/dashboard/charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  RefreshCw,
  Download,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Users,
  Clock,
  BarChart3
} from 'lucide-react'

export default function ChatAnalyticsPage() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data untuk demonstrasi
  const chatMetrics = {
    totalChats: 3421,
    activeUsers: 156,
    avgResponseTime: 1.2,
    satisfactionRate: 94.5
  }

  const recentChats = [
    {
      id: '1',
      user: 'Ahmad Rizki',
      message: 'Bagaimana cara mendaftar program beasiswa?',
      timestamp: '2 menit yang lalu',
      status: 'completed',
      duration: '2m 15s'
    },
    {
      id: '2',
      user: 'Siti Nurhaliza',
      message: 'Informasi donasi untuk anak yatim',
      timestamp: '5 menit yang lalu',
      status: 'completed',
      duration: '3m 42s'
    },
    {
      id: '3',
      user: 'Budi Santoso',
      message: 'Jadwal kajian minggu ini',
      timestamp: '12 menit yang lalu',
      status: 'active',
      duration: '1m 05s'
    },
    {
      id: '4',
      user: 'Dewi Lestari',
      message: 'Cara mengakses materi Al-Quran',
      timestamp: '18 menit yang lalu',
      status: 'completed',
      duration: '4m 30s'
    },
    {
      id: '5',
      user: 'Muhammad Fachri',
      message: 'Biaya pendidikan untuk TK',
      timestamp: '25 menit yang lalu',
      status: 'completed',
      duration: '2m 55s'
    }
  ]

  const hourlyStats = [
    { hour: '00:00', chats: 45, users: 12, avgTime: 1.1 },
    { hour: '04:00', chats: 32, users: 8, avgTime: 0.9 },
    { hour: '08:00', chats: 156, users: 45, avgTime: 1.4 },
    { hour: '12:00', chats: 234, users: 67, avgTime: 1.6 },
    { hour: '16:00', chats: 189, users: 52, avgTime: 1.3 },
    { hour: '20:00', chats: 278, users: 78, avgTime: 1.5 }
  ]

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulasi refresh data
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return t('status.completed')
      case 'active': return t('status.active')
      case 'error': return t('status.error')
      default: return status
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('nav.chatAnalytics')}
          </h2>
          <p className="text-muted-foreground">
            {t('chatAnalytics.subtitle', 'Monitor real-time chat performance and user interactions')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Jam</SelectItem>
                <SelectItem value="24h">24 Jam</SelectItem>
                <SelectItem value="7d">7 Hari</SelectItem>
                <SelectItem value="30d">30 Hari</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t('actions.refresh')}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {t('actions.export')}
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <StatsCards />
      <DetailedStats />

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="trends">{t('tabs.trends')}</TabsTrigger>
          <TabsTrigger value="conversations">{t('tabs.conversations')}</TabsTrigger>
          <TabsTrigger value="performance">{t('tabs.performance')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.totalChats')}</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatMetrics.totalChats.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  +12.5% dari minggu lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.activeUsers')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatMetrics.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  +8.2% dari kemarin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.avgResponseTime')}</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatMetrics.avgResponseTime}s</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingDown className="inline h-3 w-3 text-green-500 mr-1" />
                  -0.3s improvement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('metrics.satisfaction')}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{chatMetrics.satisfactionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
                  +2.1% dari bulan lalu
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <ChatVolumeChart />
            <PerformanceChart />
          </div>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('chatAnalytics.recentConversations')}</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('chatAnalytics.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-[250px]"
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('chatAnalytics.user')}</TableHead>
                    <TableHead>{t('chatAnalytics.message')}</TableHead>
                    <TableHead>{t('chatAnalytics.time')}</TableHead>
                    <TableHead>{t('chatAnalytics.duration')}</TableHead>
                    <TableHead>{t('chatAnalytics.status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentChats.filter(chat =>
                    chat.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    chat.message.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((chat) => (
                    <TableRow key={chat.id}>
                      <TableCell className="font-medium">{chat.user}</TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate">
                          {chat.message}
                        </div>
                      </TableCell>
                      <TableCell>{chat.timestamp}</TableCell>
                      <TableCell>{chat.duration}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(chat.status)}>
                          {getStatusText(chat.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('chatAnalytics.hourlyStats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('chatAnalytics.time')}</TableHead>
                    <TableHead>{t('chatAnalytics.chats')}</TableHead>
                    <TableHead>{t('chatAnalytics.users')}</TableHead>
                    <TableHead>{t('chatAnalytics.avgResponse')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hourlyStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell>{stat.hour}</TableCell>
                      <TableCell>{stat.chats}</TableCell>
                      <TableCell>{stat.users}</TableCell>
                      <TableCell>{stat.avgTime}s</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}