'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  CreditCard,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  BarChart3,
  MessageSquare,
  Database,
  Globe,
  Zap,
  Star,
  Crown,
  RefreshCw,
  Download
} from 'lucide-react'

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data - in real app, this would be fetched based on userId
  const user = {
    id: 'USR001',
    name: 'Ahmad Rahman',
    email: 'ahmad.rahman@email.com',
    phone: '+62 812-3456-7890',
    avatar: '/avatars/user1.jpg',
    plan: 'Enterprise',
    status: 'active',
    role: 'admin',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-15 14:30:00',
    emailVerified: true,
    twoFactorEnabled: true,
    address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    city: 'Jakarta',
    country: 'Indonesia',
    postalCode: '12345',
    timezone: 'Asia/Jakarta',
    language: 'id',
    currency: 'IDR'
  }

  // Mock transaction history
  const transactions = [
    {
      id: 'TRX001',
      date: '2024-01-15',
      type: 'subscription',
      description: 'Enterprise Plan - Monthly',
      amount: 2990000,
      status: 'completed',
      paymentMethod: 'Credit Card',
      invoiceId: 'INV-2024-001'
    },
    {
      id: 'TRX002',
      date: '2023-12-15',
      type: 'subscription',
      description: 'Enterprise Plan - Monthly',
      amount: 2990000,
      status: 'completed',
      paymentMethod: 'Credit Card',
      invoiceId: 'INV-2023-012'
    },
    {
      id: 'TRX003',
      date: '2023-11-15',
      type: 'upgrade',
      description: 'Plan Upgrade: Professional → Enterprise',
      amount: 1991000,
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      invoiceId: 'INV-2023-011'
    },
    {
      id: 'TRX004',
      date: '2023-10-20',
      type: 'setup',
      description: 'Setup Fee - Enterprise',
      amount: 5000000,
      status: 'completed',
      paymentMethod: 'Credit Card',
      invoiceId: 'INV-2023-010'
    }
  ]

  // Mock services usage data
  const servicesUsage = [
    {
      service: 'AI Chat Assistant',
      usage: '12,456 conversations',
      limit: 'Unlimited',
      percentage: 82,
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      service: 'Knowledge Base',
      usage: '1,234 documents',
      limit: '5,000 documents',
      percentage: 25,
      icon: Database,
      color: 'bg-green-500'
    },
    {
      service: 'API Calls',
      usage: '125,000 calls',
      limit: '1,000,000 calls',
      percentage: 13,
      icon: Globe,
      color: 'bg-purple-500'
    },
    {
      service: 'Storage',
      usage: '45.6 GB',
      limit: '100 GB',
      percentage: 46,
      icon: Zap,
      color: 'bg-orange-500'
    }
  ]

  // Mock activity analytics data
  const activityData = [
    { date: '2024-01-15', logins: 3, chats: 45, apiCalls: 234 },
    { date: '2024-01-14', logins: 2, chats: 38, apiCalls: 198 },
    { date: '2024-01-13', logins: 4, chats: 52, apiCalls: 289 },
    { date: '2024-01-12', logins: 1, chats: 23, apiCalls: 145 },
    { date: '2024-01-11', logins: 3, chats: 41, apiCalls: 267 }
  ]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      inactive: { variant: 'secondary' as const, icon: XCircle, color: 'text-gray-600' },
      suspended: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      Enterprise: { variant: 'default' as const, icon: Crown, color: 'text-purple-600' },
      Professional: { variant: 'secondary' as const, icon: Star, color: 'text-blue-600' },
      Starter: { variant: 'outline' as const, icon: Zap, color: 'text-green-600' }
    }

    const config = planConfig[plan as keyof typeof planConfig] || planConfig.Starter
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {plan}
      </Badge>
    )
  }

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
  const avgDailyUsage = activityData.reduce((sum, d) => sum + d.chats, 0) / activityData.length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Detail User</h2>
            <p className="text-muted-foreground">
              Informasi lengkap dan aktivitas user
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(user.status)}
                  {getPlanBadge(user.plan)}
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
            </CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={user.name}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                  {user.emailVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={user.phone}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  value={`${user.address}, ${user.city}, ${user.country} ${user.postalCode}`}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select defaultValue={user.role} disabled={!isEditing}>
                  <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Paket Langganan</Label>
                <Select defaultValue={user.plan} disabled={!isEditing}>
                  <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verified</Label>
                  <p className="text-sm text-muted-foreground">
                    Status verifikasi email
                  </p>
                </div>
                <Switch checked={user.emailVerified} disabled={!isEditing} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>2FA Enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication
                  </p>
                </div>
                <Switch checked={user.twoFactorEnabled} disabled={!isEditing} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent, 'IDR')}</div>
            <p className="text-xs text-muted-foreground">
              Sejak {user.joinDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Usage</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgDailyUsage)}</div>
            <p className="text-xs text-muted-foreground">
              Chats per hari
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.6GB</div>
            <p className="text-xs text-muted-foreground">
              Dari 100GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">
              {new Date(user.lastLogin).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
          <TabsTrigger value="services">Layanan Digunakan</TabsTrigger>
          <TabsTrigger value="analytics">Aktivitas Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm">{new Date(user.joinDate).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Chats</span>
                    <span className="text-sm font-bold">12,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Calls</span>
                    <span className="text-sm font-bold">125,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Documents</span>
                    <span className="text-sm font-bold">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Team Members</span>
                    <span className="text-sm font-bold">25</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Timezone</span>
                    <span className="text-sm">{user.timezone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Language</span>
                    <span className="text-sm">{user.language.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Currency</span>
                    <span className="text-sm">{user.currency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account ID</span>
                    <span className="text-sm font-mono">{user.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created At</span>
                    <span className="text-sm">{new Date(user.joinDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Metode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {transaction.type === 'subscription' ? 'Subscription' :
                           transaction.type === 'upgrade' ? 'Upgrade' : 'Setup'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount, 'IDR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layanan yang Digunakan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {servicesUsage.map((service) => {
                  const Icon = service.icon
                  return (
                    <div key={service.service} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{service.service}</h4>
                            <p className="text-sm text-muted-foreground">{service.usage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{service.limit}</div>
                          <div className="text-xs text-muted-foreground">{service.percentage}% digunakan</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${service.color} h-2 rounded-full`}
                          style={{ width: `${service.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Aktivitas Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Daily activity chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Usage Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Usage trends chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Login</TableHead>
                    <TableHead>Chats</TableHead>
                    <TableHead>API Calls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityData.map((data) => (
                    <TableRow key={data.date}>
                      <TableCell>{new Date(data.date).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{data.logins}x</TableCell>
                      <TableCell>{data.chats}</TableCell>
                      <TableCell>{data.apiCalls.toLocaleString()}</TableCell>
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