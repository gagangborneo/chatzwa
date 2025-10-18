'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  MessageSquare,
  Users,
  Settings,
  Globe,
  Smartphone,
  Plug,
  BarChart3,
  RefreshCw,
  Database,
  Zap,
  TrendingUp,
  Eye,
  Edit,
  Share2,
  ArrowLeft,
} from 'lucide-react'

// Mock data for chatbot details
const mockChatbotData = {
  id: '1',
  name: 'Customer Support Assistant',
  description: 'Handles customer inquiries and support tickets',
  status: 'active',
  avatar: '🤖',
  conversations: 1234,
  avgResponseTime: '2.3s',
  satisfaction: '94%',
  lastActive: '2 hours ago',
  createdAt: '2024-01-15',
  model: 'gpt-3.5-turbo',
  language: 'Indonesian',
  integrations: ['WhatsApp', 'Website Widget'],
  knowledgeBase: {
    documents: 156,
    lastUpdated: '1 day ago'
  }
}

export default function ChatbotDashboardPage() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()
  const [chatbotData, setChatbotData] = useState(mockChatbotData)
  const [isLoading, setIsLoading] = useState(true)

  // Extract chatbot ID from pathname
  const chatbotId = pathname.split('/')[3] || ''

  useEffect(() => {
    // Simulate loading chatbot data
    const loadChatbot = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, fetch from API: `/api/chatbots/${chatbotId}`
      setChatbotData(mockChatbotData)
      setIsLoading(false)
    }

    loadChatbot()
  }, [chatbotId])

  const handleBack = () => {
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

      {/* Main Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('chatbot.dashboard.totalConversations', 'Total Conversations')}
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbotData.conversations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {t('chatbot.dashboard.conversationsGrowth', '+12% from last month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('chatbot.dashboard.avgResponseTime', 'Avg Response Time')}
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbotData.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              {t('chatbot.dashboard.responseImprovement', '-0.5s from last week')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('chatbot.dashboard.satisfaction', 'Satisfaction Rate')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbotData.satisfaction}</div>
            <p className="text-xs text-muted-foreground">
              {t('chatbot.dashboard.satisfactionImprovement', '+3% from last month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('chatbot.dashboard.knowledgeBase', 'Knowledge Base')}
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chatbotData.knowledgeBase.documents}</div>
            <p className="text-xs text-muted-foreground">
              {t('chatbot.dashboard.lastUpdated', 'Updated 1 day ago')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/chatbot/${chatbotId}/persona`)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t('chatbot.dashboard.configurePersona', 'Configure Persona')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {t('chatbot.dashboard.personaDescription', 'Customize your AI personality, tone, and response style')}
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <span>{t('chatbot.dashboard.configure', 'Configure')}</span>
              <div className="ml-auto w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/chatbot/${chatbotId}/knowledge`)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {t('chatbot.dashboard.manageKnowledge', 'Manage Knowledge Base')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {t('chatbot.dashboard.knowledgeDescription', 'Upload documents and train your AI with relevant information')}
            </p>
            <div className="flex items-center text-sm text-green-600">
              <span>{t('chatbot.dashboard.manage', 'Manage')}</span>
              <div className="ml-auto w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/chatbot/${chatbotId}/sync`)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {t('chatbot.dashboard.dataSync', 'Data Synchronization')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {t('chatbot.dashboard.syncDescription', 'Sync data from external sources and databases')}
            </p>
            <div className="flex items-center text-sm text-purple-600">
              <span>{t('chatbot.dashboard.configure', 'Configure')}</span>
              <div className="ml-auto w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/chatbot/${chatbotId}/analytics`)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('chatbot.dashboard.analytics', 'Analytics & Insights')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {t('chatbot.dashboard.analyticsDescription', 'View detailed performance metrics and user behavior')}
            </p>
            <div className="flex items-center text-sm text-orange-600">
              <span>{t('chatbot.dashboard.viewAnalytics', 'View Analytics')}</span>
              <div className="ml-auto w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/chatbot/${chatbotId}/integrations`)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-5 w-5" />
              {t('chatbot.dashboard.integrations', 'Integrations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {t('chatbot.dashboard.integrationsDescription', 'Connect with WhatsApp, website, and other platforms')}
            </p>
            <div className="flex items-center text-sm text-indigo-600">
              <span>{t('chatbot.dashboard.manage', 'Manage')}</span>
              <div className="ml-auto w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/dashboard/chatbot/${chatbotId}/settings`)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('chatbot.dashboard.settings', 'Settings & Configuration')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              {t('chatbot.dashboard.settingsDescription', 'Advanced settings, API keys, and configuration options')}
            </p>
            <div className="flex items-center text-sm text-gray-600">
              <span>{t('chatbot.dashboard.configure', 'Configure')}</span>
              <div className="ml-auto w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs">→</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t('chatbot.dashboard.recentActivity', 'Recent Activity')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              action: 'New documents added',
              count: 12,
              time: '2 hours ago',
              type: 'success'
            },
            {
              action: 'Knowledge base updated',
              count: 5,
              time: '4 hours ago',
              type: 'info'
            },
            {
              action: 'Integration connected',
              count: 1,
              time: '6 hours ago',
              type: 'success'
            },
            {
              action: 'Persona updated',
              count: 1,
              time: '1 day ago',
              type: 'default'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'info' ? 'bg-blue-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <Badge variant="secondary">{activity.count}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}