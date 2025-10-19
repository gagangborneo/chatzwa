'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  Activity,
  Bot,
  MessageCircle,
  Crown,
  Clock,
  Globe,
  Smartphone,
  FileText,
  Database,
  History,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  CreditCard,
  Key,
} from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

interface UserDetails {
  id: string
  email: string
  name: string | null
  role: string
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  _count: {
    subscriptions: number
    chatbots: number
    chatMessages: number
    knowledgeCategories: number
    knowledgeDocuments: number
    documentUploads: number
    personas: number
    whatsappIntegrations: number
    sessions: number
  }
}

interface ActiveSubscription {
  id: string
  status: string
  package: {
    name: string
    displayName: string
    price: number
    currency: string
    billingCycle: string
  }
  startDate: string
  endDate: string | null
  nextBillingDate: string | null
}

interface ChatMessage {
  id: string
  message: string
  response: string
  timestamp: string
  source: string
  persona: {
    name: string
  } | null
}

interface Chatbot {
  id: string
  name: string
  status: string
  totalMessages: number
  totalTokens: number
  lastUsedAt: string | null
  createdAt: string
}

interface UserSession {
  id: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  expiresAt: string
}

interface SubscriptionHistory {
  id: string
  status: string
  package: {
    name: string
    displayName: string
  }
  startDate: string
  endDate: string | null
  createdAt: string
}

interface UserDetailResponse {
  user: UserDetails
  activeSubscription: ActiveSubscription | null
  recentChatMessages: ChatMessage[]
  recentChatbots: Chatbot[]
  userSessions: UserSession[]
  subscriptionHistory: SubscriptionHistory[]
  stats: {
    totalMessages: number
    totalChatbots: number
    totalKnowledgeDocs: number
    totalSubscriptions: number
    activeSessions: number
    avgMessagesPerChatbot: number
  }
}

export default function UserDetailPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [userDetails, setUserDetails] = useState<UserDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dateLocale = locale === 'id' ? idLocale : enUS

  const fetchUserDetails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const result = await response.json()

      if (result.success) {
        setUserDetails(result.data)
      } else {
        setError(result.error || 'Failed to fetch user details')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case 'user':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <User className="w-3 h-3 mr-1" />
            User
          </Badge>
        )
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const getStatusBadge = (isActive: boolean, lastLoginAt: string | null) => {
    if (!isActive) {
      return (
        <Badge variant="destructive" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
          <XCircle className="w-3 h-3 mr-1" />
          Inactive
        </Badge>
      )
    }

    if (lastLoginAt) {
      const lastLogin = new Date(lastLoginAt)
      const now = new Date()
      const daysSinceLogin = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))

      if (daysSinceLogin <= 7) {
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      } else if (daysSinceLogin <= 30) {
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Activity className="w-3 h-3 mr-1" />
            Recent
          </Badge>
        )
      }
    }

    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
        <Calendar className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    try {
      return format(new Date(dateString), 'PPp', { locale: dateLocale })
    } catch {
      return 'Invalid date'
    }
  }

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)} days ago`

      return formatDate(dateString)
    } catch {
      return 'Invalid date'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !userDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error || 'User not found'}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-slate-600" />
              User Details
            </h1>
            <p className="text-gray-500 mt-1">
              {userDetails.user.name || userDetails.user.email}
            </p>
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Name</div>
              <div className="font-semibold text-gray-900">
                {userDetails.user.name || 'Not provided'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <div className="font-semibold text-gray-900">
                {userDetails.user.email}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Role</div>
              <div>{getRoleBadge(userDetails.user.role)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600">Status</div>
              <div>{getStatusBadge(userDetails.user.isActive, userDetails.user.lastLoginAt)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Member Since
              </div>
              <div className="font-semibold text-gray-900">
                {formatDate(userDetails.user.createdAt)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Activity className="w-4 h-4" />
                Last Login
              </div>
              <div className="font-semibold text-gray-900">
                {formatRelativeTime(userDetails.user.lastLoginAt)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Last Updated
              </div>
              <div className="font-semibold text-gray-900">
                {formatDate(userDetails.user.updatedAt)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Key className="w-4 h-4" />
                User ID
              </div>
              <div className="font-mono text-xs text-gray-600">
                {userDetails.user.id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userDetails.stats.totalMessages.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chatbots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userDetails.stats.totalChatbots}</div>
            <div className="text-sm text-gray-500">
              {userDetails.stats.avgMessagesPerChatbot} avg messages per bot
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Knowledge Docs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userDetails.stats.totalKnowledgeDocs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{userDetails.stats.totalSubscriptions}</div>
            <div className="text-sm text-gray-500">
              {userDetails.userSessions.length} active sessions
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Subscription */}
      {userDetails.activeSubscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Active Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Plan</div>
                <div className="font-semibold text-gray-900">
                  {userDetails.activeSubscription.package.displayName}
                </div>
                <Badge variant="outline">
                  {userDetails.activeSubscription.package.billingCycle}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Period</div>
                <div className="font-semibold text-gray-900">
                  {formatDate(userDetails.activeSubscription.startDate)} - {' '}
                  {formatDate(userDetails.activeSubscription.endDate)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600">Next Billing</div>
                <div className="font-semibold text-gray-900">
                  {formatDate(userDetails.activeSubscription.nextBillingDate)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Tabs */}
      <Tabs defaultValue="chatbots" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="chatbots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Chatbots</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.recentChatbots.length === 0 ? (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No chatbots</h3>
                  <p className="text-gray-500">This user hasn't created any chatbots yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.recentChatbots.map((chatbot) => (
                      <TableRow key={chatbot.id}>
                        <TableCell className="font-medium">{chatbot.name}</TableCell>
                        <TableCell>
                          <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>
                            {chatbot.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{chatbot.totalMessages.toLocaleString()}</TableCell>
                        <TableCell>{chatbot.totalTokens.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">
                          {formatRelativeTime(chatbot.lastUsedAt)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(chatbot.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.recentChatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
                  <p className="text-gray-500">This user hasn't sent any messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userDetails.recentChatMessages.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{message.source}</Badge>
                          {message.persona && (
                            <span className="text-sm text-gray-500">
                              via {message.persona.name}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-blue-600">User:</span> {message.message}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-green-600">AI:</span> {message.response}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.userSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active sessions</h3>
                  <p className="text-gray-500">This user has no active sessions.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.userSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">
                          {session.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{session.ipAddress || 'Unknown'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {session.userAgent || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(session.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(session.expiresAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails.subscriptionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions</h3>
                  <p className="text-gray-500">This user hasn't had any subscriptions yet.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userDetails.subscriptionHistory.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">
                          {subscription.package.displayName}
                        </TableCell>
                        <TableCell>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(subscription.startDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(subscription.endDate)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(subscription.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}