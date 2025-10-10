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
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Edit,
  Trash2,
  Crown,
  Zap,
  Shield,
  Users,
  BarChart3,
  FileText,
  Database,
  Smartphone,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'

export default function BillingPage() {
  const { t } = useI18n()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [isLoading, setIsLoading] = useState(false)

  // Mock subscription data
  const currentSubscription = {
    plan: 'Professional',
    status: 'active',
    price: 990000,
    currency: 'IDR',
    billingCycle: 'monthly',
    nextBillingDate: '2024-02-15',
    features: [
      'Unlimited conversations',
      'Advanced AI models',
      'Priority support',
      'Custom knowledge base',
      'API access',
      'Team collaboration'
    ]
  }

  const usageStats = {
    conversations: { used: 847, limit: 1000, percentage: 84.7 },
    tokens: { used: 245000, limit: 300000, percentage: 81.7 },
    knowledgeBase: { used: 1247, limit: 2000, percentage: 62.4 },
    teamMembers: { used: 8, limit: 15, percentage: 53.3 }
  }

  const billingHistory = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      description: 'Professional Plan - Monthly',
      amount: 990000,
      status: 'paid',
      method: 'Credit Card',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-15',
      description: 'Professional Plan - Monthly',
      amount: 990000,
      status: 'paid',
      method: 'Credit Card',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-15',
      description: 'Professional Plan - Monthly',
      amount: 990000,
      status: 'paid',
      method: 'Credit Card',
      downloadUrl: '#'
    }
  ]

  const paymentMethods = [
    {
      id: 'card-1',
      type: 'credit_card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 299000, yearly: 3230000 },
      currency: 'IDR',
      features: [
        '500 conversations/month',
        'Basic AI models',
        'Email support',
        '100 knowledge base documents',
        '1 team member'
      ],
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-blue-500',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 990000, yearly: 10780000 },
      currency: 'IDR',
      features: [
        'Unlimited conversations',
        'Advanced AI models',
        'Priority support',
        '2000 knowledge base documents',
        '15 team members',
        'API access',
        'Custom integrations'
      ],
      icon: <Crown className="h-5 w-5" />,
      color: 'bg-purple-500',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 2990000, yearly: 32500000 },
      currency: 'IDR',
      features: [
        'Unlimited everything',
        'Custom AI models',
        '24/7 dedicated support',
        'Unlimited knowledge base',
        'Unlimited team members',
        'Advanced API features',
        'Custom integrations',
        'On-premise deployment option',
        'SLA guarantee'
      ],
      icon: <Shield className="h-5 w-5" />,
      color: 'bg-orange-500',
      popular: false
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return t('billing.status.active')
      case 'inactive': return t('billing.status.inactive')
      case 'cancelled': return t('billing.status.cancelled')
      case 'paid': return t('billing.status.paid')
      case 'pending': return t('billing.status.pending')
      case 'failed': return t('billing.status.failed')
      default: return status
    }
  }

  const formatCurrency = (amount: number, currency: string = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t('nav.billing')}
          </h2>
          <p className="text-muted-foreground">
            {t('billing.subtitle', 'Manage your subscription and billing information')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t('billing.downloadInvoices')}
          </Button>
        </div>
      </div>

      {/* Current Subscription Alert */}
      <Alert className="border-purple-200 bg-purple-50">
        <Crown className="h-4 w-4 text-purple-600" />
        <AlertDescription>
          <span className="font-medium text-purple-900">
            {currentSubscription.plan} {t('billing.plan')}
          </span> - {t('billing.nextBilling', { date: formatDate(currentSubscription.nextBillingDate) })}
        </AlertDescription>
      </Alert>

      {/* Usage Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('billing.conversations')}</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.conversations.used}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={usageStats.conversations.percentage} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {usageStats.conversations.used}/{usageStats.conversations.limit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('billing.ofLimit')} {usageStats.conversations.percentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('billing.tokens')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.tokens.used.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={usageStats.tokens.percentage} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {usageStats.tokens.used.toLocaleString()}/{usageStats.tokens.limit.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('billing.ofLimit')} {usageStats.tokens.percentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('billing.knowledgeBase')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.knowledgeBase.used}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={usageStats.knowledgeBase.percentage} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {usageStats.knowledgeBase.used}/{usageStats.knowledgeBase.limit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('billing.ofLimit')} {usageStats.knowledgeBase.percentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('billing.teamMembers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usageStats.teamMembers.used}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={usageStats.teamMembers.percentage} className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {usageStats.teamMembers.used}/{usageStats.teamMembers.limit}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('billing.ofLimit')} {usageStats.teamMembers.percentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Billing Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('billing.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="plans">{t('billing.tabs.plans')}</TabsTrigger>
          <TabsTrigger value="payment">{t('billing.tabs.payment')}</TabsTrigger>
          <TabsTrigger value="history">{t('billing.tabs.history')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-500" />
                  {t('billing.currentPlan')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{currentSubscription.plan}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(currentSubscription.price, currentSubscription.currency)}/{t('billing.month')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(currentSubscription.status)}>
                    {getStatusText(currentSubscription.status)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">{t('billing.includedFeatures')}</h4>
                  <ul className="space-y-1">
                    {currentSubscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('billing.nextBilling')}</span>
                    <span className="font-medium">{formatDate(currentSubscription.nextBillingDate)}</span>
                  </div>
                </div>

                <Button className="w-full">
                  {t('billing.manageSubscription')}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('billing.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('billing.updatePaymentMethod')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  {t('billing.manageTeam')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {t('billing.downloadInvoices')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('billing.billingEmail')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  {t('billing.contactSupport')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{t('billing.choosePlan')}</h3>
            <p className="text-muted-foreground">{t('billing.choosePlanDescription')}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-purple-200 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">
                      {t('billing.mostPopular')}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-2 rounded-full ${plan.color} bg-opacity-10 mb-4`}>
                    <div className={`${plan.color} bg-opacity-100 text-white p-2 rounded-full`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      {formatCurrency(plan.price[selectedPeriod as keyof typeof plan.price])}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      /{selectedPeriod === 'monthly' ? t('billing.month') : t('billing.year')}
                    </p>
                    {selectedPeriod === 'yearly' && (
                      <p className="text-sm text-green-600">
                        {t('billing.saveYearly', { percentage: 10 })}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                    variant={currentSubscription.plan.toLowerCase() === plan.id ? 'outline' : 'default'}
                  >
                    {currentSubscription.plan.toLowerCase() === plan.id
                      ? t('billing.currentPlan')
                      : t('billing.upgradePlan')
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.paymentMethods')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{method.brand}</span>
                        <span className="text-sm text-muted-foreground">•••• {method.last4}</span>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            {t('billing.default')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('billing.expires')} {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    {!method.isDefault && (
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                {t('billing.addPaymentMethod')}
              </Button>
            </CardContent>
          </Card>

          {/* Billing Email */}
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.billingEmail')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">admin@yayasanattallah.org</p>
                  <p className="text-sm text-muted-foreground">{t('billing.billingEmailDescription')}</p>
                </div>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('billing.change')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.billingHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('billing.invoiceNumber')}</TableHead>
                    <TableHead>{t('billing.date')}</TableHead>
                    <TableHead>{t('billing.description')}</TableHead>
                    <TableHead>{t('billing.amount')}</TableHead>
                    <TableHead>{t('billing.status')}</TableHead>
                    <TableHead>{t('billing.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
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
      </Tabs>
    </div>
  )
}