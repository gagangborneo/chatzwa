'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Bot,
  Plus,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
  ChevronRight,
  Activity,
  Loader2,
  AlertCircle,
  Check,
  MessageCircle,
  FileText,
  Download,
  Edit,
  TrendingUp as Upgrade,
  HelpCircle,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Zap,
  Shield,
  Star,
  Package,
  Crown,
  CheckCircle,
  Clock,
  RefreshCw,
  XCircle,
  Gift,
  Share2,
  Users2,
  TrendingUp,
} from 'lucide-react'

// TypeScript interfaces
interface ChatbotData {
  id: string
  slug?: string
  name: string
  description: string
  profile: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  stats: {
    totalMessages: number
    messagesThisMonth: number
    webMessages: number
    whatsappMessages: number
    avgResponseTime: string
  }
}

interface UserData {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalPersonas: number
  activePersonas: number
  totalMessages: number
  messagesThisMonth: number
  totalIntegrations: number
  activeIntegrations: number
  totalCategories: number
  activeCategories: number
  totalDocuments: number
  indexedDocuments: number
}

interface SubscriptionData {
  id: string
  status: string
  package: {
    id: string
    name: string
    displayName: string
    price: number
    currency: string
    billingCycle: string
    features: any
    maxChatbots: number | null
    maxMessages: number | null
  }
  startDate: string
  endDate?: string
  nextBillingDate?: string
  isAutoRenew: boolean
  currentUsage?: any
}

interface UsageStats {
  chatbots: {
    current: number
    limit: number | null
    percentage: number
    isUnlimited: boolean
  }
  messages: {
    current: number
    limit: number | null
    percentage: number
    isUnlimited: boolean
  }
  knowledgeDocs: {
    current: number
    limit: number | null
    percentage: number
    isUnlimited: boolean
  }
  apiCalls: {
    current: number
    limit: number | null
    percentage: number
    isUnlimited: boolean
  }
}


interface AccountFormData {
  name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  country: string
}

interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
  icon: React.ElementType
}

// Transaction interface untuk UI (bukan dari database)
interface Transaction {
  id: string
  type: 'subscription' | 'renewal' | 'upgrade' | 'downgrade' | 'setup_fee' | 'overage'
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  description: string
  subscriptionPlan?: string
  createdAt: string
  updatedAt: string
  invoiceId?: string
}

interface TransactionFormData {
  type: 'subscription' | 'topup'
  planId?: string
  amount: number
  description: string
}

// Affiliate interfaces
interface AffiliateProfile {
  id: string
  userId: string
  isActive: boolean
  commissionRate: number
  customCommission?: number
  referralCode: string
  referralLink: string
  totalReferrals: number
  activeReferrals: number
  totalCommissions: number
  paidCommissions: number
  pendingCommissions: number
  lastPayoutAt?: string
  totalPayouts: number
  createdAt: string
  updatedAt: string
}

interface AffiliateCommission {
  id: string
  affiliateId: string
  referralId?: string
  transactionId?: string
  subscriptionId?: string
  commissionType: string
  baseAmount: number
  commissionRate: number
  commissionAmount: number
  currency: string
  status: string
  approvedAt?: string
  paidAt?: string
  rejectedAt?: string
  rejectionReason?: string
  payoutId?: string
  createdAt: string
  updatedAt: string
}

interface AffiliatePayout {
  id: string
  affiliateId: string
  totalAmount: number
  commissionCount: number
  currency: string
  status: string
  processedAt?: string
  completedAt?: string
  failedAt?: string
  failureReason?: string
  paymentMethod?: string
  paymentDetails?: any
  processorId?: string
  processorNotes?: string
  externalPayoutId?: string
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}

export function DashboardContent() {
  const router = useRouter()
  const { t } = useI18n()

  // State for data
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [chatbots, setChatbots] = useState<ChatbotData[]>([])
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')


  const [accountForm, setAccountForm] = useState<AccountFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: ''
  })

  const [selectedPlan, setSelectedPlan] = useState<string>('pro')

  // Form submission states
  const [submittingAccount, setSubmittingAccount] = useState(false)
  const [submittingPayment, setSubmittingPayment] = useState(false)

  // Transaction states
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [transactionForm, setTransactionForm] = useState<TransactionFormData>({
    type: 'subscription',
    planId: 'pro',
    amount: 1200000,
    description: 'Buat langganan Pro Plan'
  })

  // Affiliate states
  const [affiliateProfile, setAffiliateProfile] = useState<AffiliateProfile | null>(null)
  const [affiliateCommissions, setAffiliateCommissions] = useState<AffiliateCommission[]>([])
  const [affiliatePayouts, setAffiliatePayouts] = useState<AffiliatePayout[]>([])
  const [showCreateAffiliateForm, setShowCreateAffiliateForm] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  // Pricing plans
  const pricingPlans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 450000,
      currency: 'IDR',
      interval: 'monthly',
      icon: Package,
      features: [
        '1 Chatbot',
        '1,000 messages/bulan',
        'Analytics dasar',
        'Support email',
        'Knowledge base (100 dokumen)'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 1200000,
      currency: 'IDR',
      interval: 'monthly',
      popular: true,
      icon: Zap,
      features: [
        '5 Chatbots',
        '10,000 messages/bulan',
        'Analytics lanjutan',
        'Support prioritas',
        'Knowledge base (1.000 dokumen)',
        'Integrasi kustom',
        'Integrasi WhatsApp'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 3000000,
      currency: 'IDR',
      interval: 'monthly',
      icon: Crown,
      features: [
        'Unlimited Chatbots',
        'Unlimited messages',
        'Analytics kustom',
        'Support dedicated',
        'Knowledge base unlimited',
        'Semua integrasi',
        'Custom AI model training',
        'SLA guarantee'
      ]
    }
  ]

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch user data
        const userResponse = await fetch('/api/user/me')
        if (userResponse.ok) {
          const userResult = await userResponse.json()
          if (userResult.success) {
            setUserData(userResult.data.user)
            setUserStats(userResult.data.stats)
          }
        }

        // Fetch subscription data
        try {
          const subscriptionResponse = await fetch('/api/subscriptions?includePackage=true')
          if (subscriptionResponse.ok) {
            const subscriptionResult = await subscriptionResponse.json()
            if (subscriptionResult.success && subscriptionResult.data.activeSubscription) {
              const activeSub = subscriptionResult.data.activeSubscription
              console.log('Active subscription found:', activeSub)

              // Fetch detailed subscription info including usage stats
              const detailResponse = await fetch(`/api/subscriptions/${activeSub.id}`)
              if (detailResponse.ok) {
                const detailResult = await detailResponse.json()
                if (detailResult.success) {
                  console.log('Subscription details:', detailResult.data)
                  setSubscription(detailResult.data.subscription)
                  setUsageStats(detailResult.data.usageStats)
                } else {
                  console.error('Failed to get subscription details:', detailResult.error)
                  // Set basic subscription data if detailed fetch fails
                  setSubscription(activeSub)
                }
              } else {
                console.error('Failed to fetch subscription details')
                // Set basic subscription data if detailed fetch fails
                setSubscription(activeSub)
              }
            } else {
              console.log('No active subscription found')
              // Set demo data for development
              setDemoSubscriptionData()
            }
          } else {
            console.error('Failed to fetch subscriptions:', subscriptionResponse.statusText)
            // Set demo data for development
            setDemoSubscriptionData()
          }
        } catch (error) {
          console.error('Error fetching subscription data:', error)
          // Set demo data for development
          setDemoSubscriptionData()
        }

        // Fetch chatbots
        const chatbotsResponse = await fetch('/api/user/chatbots')
        if (chatbotsResponse.ok) {
          const chatbotsResult = await chatbotsResponse.json()
          if (chatbotsResult.success) {
            setChatbots(chatbotsResult.data.chatbots)
          }
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateChatbot = () => {
    // Check if user can create more chatbots based on subscription
    if (usageStats && !usageStats.chatbots.isUnlimited && usageStats.chatbots.current >= usageStats.chatbots.limit) {
      alert(`Anda telah mencapai batas maksimum chatbot (${usageStats.chatbots.limit}). Upgrade paket Anda untuk membuat lebih banyak chatbot.`)
      return
    }

    if (!subscription || !subscription.package || subscription.status !== 'active') {
      alert('Anda perlu berlangganan paket untuk membuat chatbot. Silakan pilih paket yang sesuai.')
      return
    }

    router.push('/dashboard/chatbots/create')
  }

  const handleViewChatbot = (chatbotId: string) => {
    router.push(`/dashboard/chatbot/${chatbotId}`)
  }

  const handleToggleActive = async (chatbotId: string) => {
    try {
      const response = await fetch(`/api/user/chatbots/${chatbotId}/toggle`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh chatbots list
          const chatbotsResponse = await fetch('/api/user/chatbots')
          if (chatbotsResponse.ok) {
            const chatbotsResult = await chatbotsResponse.json()
            if (chatbotsResult.success) {
              setChatbots(chatbotsResult.data.chatbots)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error toggling chatbot status:', error)
    }
  }

  const handleDeleteChatbot = async (chatbotId: string, chatbotName: string) => {
    if (!confirm(`Are you sure you want to delete "${chatbotName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/user/chatbots/${chatbotId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Remove from local state
          setChatbots(prev => prev.filter(chatbot => chatbot.id !== chatbotId))
        }
      }
    } catch (error) {
      console.error('Error deleting chatbot:', error)
    }
  }

  // Form handlers

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingAccount(true)

    try {
      const response = await fetch('/api/user/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountForm),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Update user data
          setUserData(prev => prev ? { ...prev, ...accountForm } : null)
        }
      }
    } catch (error) {
      console.error('Error updating account:', error)
    } finally {
      setSubmittingAccount(false)
    }
  }

  const handlePaymentSubmit = async (planId: string) => {
    setSubmittingPayment(true)
    setSelectedPlan(planId)

    try {
      const response = await fetch('/api/user/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Handle successful subscription
          router.push('/dashboard/billing')
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
    } finally {
      setSubmittingPayment(false)
    }
  }

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingPayment(true)

    try {
      const response = await fetch('/api/user/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionForm),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Reset form and refresh transactions
          setTransactionForm({
            type: 'subscription',
            planId: 'pro',
            amount: 79,
            description: 'Buat langganan Pro Plan'
          })
          setShowTransactionForm(false)

          // Refresh transactions
          const transactionsResponse = await fetch('/api/user/transactions')
          if (transactionsResponse.ok) {
            const transactionsResult = await transactionsResponse.json()
            if (transactionsResult.success) {
              setTransactions(transactionsResult.data.transactions)
            }
          }

          // Refresh subscription
          const subscriptionResponse = await fetch('/api/user/subscription')
          if (subscriptionResponse.ok) {
            const subscriptionResult = await subscriptionResponse.json()
            if (subscriptionResult.success) {
              setSubscription(subscriptionResult.data.subscription)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
    } finally {
      setSubmittingPayment(false)
    }
  }

  // Fetch transactions and subscription data
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        // For demo purposes, always use sample data
        // In production, this would fetch from actual API

        // Set sample transaction data for demo
        setTransactions([
          {
            id: 'txn_001',
            type: 'subscription',
            amount: 1200000,
            currency: 'IDR',
            status: 'completed',
            description: 'Buat langganan Pro Plan',
            subscriptionPlan: 'Pro Plan (Bulanan)',
            createdAt: new Date('2024-10-15T10:30:00Z').toISOString(),
            updatedAt: new Date('2024-10-15T10:30:00Z').toISOString()
          },
          {
            id: 'txn_002',
            type: 'topup',
            amount: 750000,
            currency: 'IDR',
            status: 'completed',
            description: 'Top up saldo',
            createdAt: new Date('2024-10-10T14:20:00Z').toISOString(),
            updatedAt: new Date('2024-10-10T14:20:00Z').toISOString()
          },
          {
            id: 'txn_003',
            type: 'subscription',
            amount: 450000,
            currency: 'IDR',
            status: 'pending',
            description: 'Perpanjang langganan Starter Plan',
            subscriptionPlan: 'Starter Plan (Bulanan)',
            createdAt: new Date('2024-10-18T09:00:00Z').toISOString(),
            updatedAt: new Date('2024-10-18T09:00:00Z').toISOString()
          },
          {
            id: 'txn_004',
            type: 'subscription',
            amount: 3000000,
            currency: 'IDR',
            status: 'completed',
            description: 'Upgrade ke Enterprise Plan',
            subscriptionPlan: 'Enterprise Plan (Tahunan)',
            createdAt: new Date('2024-09-01T08:00:00Z').toISOString(),
            updatedAt: new Date('2024-09-01T08:00:00Z').toISOString()
          },
          {
            id: 'txn_005',
            type: 'refund',
            amount: 450000,
            currency: 'IDR',
            status: 'completed',
            description: 'Refund pembatalan langganan',
            createdAt: new Date('2024-08-25T15:45:00Z').toISOString(),
            updatedAt: new Date('2024-08-25T15:45:00Z').toISOString()
          }
        ])

        // Set sample subscription data
        setSubscription({
          id: 'sub_001',
          planId: 'pro',
          planName: 'Pro Plan',
          status: 'active',
          startDate: new Date('2024-10-01T00:00:00Z').toISOString(),
          endDate: new Date('2024-11-01T00:00:00Z').toISOString(),
          autoRenew: true,
          amount: 1200000,
          currency: 'IDR',
          interval: 'monthly'
        })

        // Optional: Try to fetch real data (will be ignored in demo)
        const transactionsResponse = await fetch('/api/user/transactions')
        if (transactionsResponse.ok) {
          const transactionsResult = await transactionsResponse.json()
          if (transactionsResult.success && transactionsResult.data.transactions.length > 0) {
            setTransactions(transactionsResult.data.transactions)
          }
        }

        const subscriptionResponse = await fetch('/api/user/subscription')
        if (subscriptionResponse.ok) {
          const subscriptionResult = await subscriptionResponse.json()
          if (subscriptionResult.success && subscriptionResult.data.subscription) {
            setSubscription(subscriptionResult.data.subscription)
          }
        }
      } catch (error) {
        console.error('Error fetching billing data:', error)
      }
    }

    fetchBillingData()

    // Fetch affiliate data
    fetchAffiliateData()

    // Set demo affiliate data for development
    setDemoAffiliateData()
  }, [])

  // Handler untuk navigasi ke invoice
  const handleViewInvoice = (transactionId: string) => {
    router.push(`/dashboard/invoice/${transactionId}`)
  }

  // Affiliate handlers
  const handleCreateAffiliateProfile = async () => {
    try {
      const response = await fetch('/api/affiliate/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setAffiliateProfile(result.data.affiliateProfile)
          setShowCreateAffiliateForm(false)
        }
      }
    } catch (error) {
      console.error('Error creating affiliate profile:', error)
    }
  }

  const handleCopyReferralLink = async () => {
    if (affiliateProfile?.referralLink) {
      try {
        await navigator.clipboard.writeText(affiliateProfile.referralLink)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (error) {
        console.error('Failed to copy referral link:', error)
      }
    }
  }

  const handleRequestPayout = async () => {
    if (!affiliateProfile || affiliateProfile.pendingCommissions === 0) return

    try {
      const response = await fetch('/api/affiliate/payout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: affiliateProfile.pendingCommissions,
          paymentMethod: 'bank_transfer'
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Refresh affiliate data
          fetchAffiliateData()
        }
      }
    } catch (error) {
      console.error('Error requesting payout:', error)
    }
  }

  const fetchAffiliateData = async () => {
    try {
      // Fetch affiliate profile
      const profileResponse = await fetch('/api/affiliate/profile')
      if (profileResponse.ok) {
        const profileResult = await profileResponse.json()
        if (profileResult.success) {
          setAffiliateProfile(profileResult.data.affiliateProfile)
        }
      }

      // Fetch commissions
      const commissionsResponse = await fetch('/api/affiliate/commissions')
      if (commissionsResponse.ok) {
        const commissionsResult = await commissionsResponse.json()
        if (commissionsResult.success) {
          setAffiliateCommissions(commissionsResult.data.commissions)
        }
      }

      // Fetch payouts
      const payoutsResponse = await fetch('/api/affiliate/payouts')
      if (payoutsResponse.ok) {
        const payoutsResult = await payoutsResponse.json()
        if (payoutsResult.success) {
          setAffiliatePayouts(payoutsResult.data.payouts)
        }
      }
    } catch (error) {
      console.error('Error fetching affiliate data:', error)
    }
  }

  // Demo subscription data for development
  const setDemoSubscriptionData = () => {
    const demoSubscription: SubscriptionData = {
      id: 'demo-subscription',
      status: 'active',
      package: {
        id: 'pro',
        name: 'pro',
        displayName: 'Pro Plan',
        price: 899000,
        currency: 'IDR',
        billingCycle: 'monthly',
        features: {
          basicAnalytics: true,
          emailSupport: true,
          customBranding: true,
          prioritySupport: true,
          advancedAnalytics: true,
          apiAccess: true,
          whatsappIntegration: false,
          customDomain: false,
          exportData: true,
          ragSystem: true,
        },
        maxChatbots: 10,
        maxMessages: 5000,
      },
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isAutoRenew: true,
    }

    const demoUsageStats: UsageStats = {
      chatbots: {
        current: 1,
        limit: 10,
        percentage: 10,
        isUnlimited: false,
      },
      messages: {
        current: 145,
        limit: 5000,
        percentage: 3,
        isUnlimited: false,
      },
      knowledgeDocs: {
        current: 12,
        limit: 200,
        percentage: 6,
        isUnlimited: false,
      },
      apiCalls: {
        current: 89,
        limit: 2500,
        percentage: 4,
        isUnlimited: false,
      },
    }

    setSubscription(demoSubscription)
    setUsageStats(demoUsageStats)
  }

  // Demo affiliate data for development
  const setDemoAffiliateData = () => {
    const demoAffiliateProfile: AffiliateProfile = {
      id: 'demo-affiliate-001',
      userId: 'demo-user-001',
      isActive: true,
      commissionRate: 0.10,
      referralCode: 'DEMO2024',
      referralLink: 'https://chatbot.example.com/register?ref=DEMO2024',
      totalReferrals: 15,
      activeReferrals: 12,
      totalCommissions: 1500000,
      paidCommissions: 900000,
      pendingCommissions: 600000,
      lastPayoutAt: new Date('2024-10-15T10:00:00Z').toISOString(),
      totalPayouts: 3,
      createdAt: new Date('2024-09-01T08:00:00Z').toISOString(),
      updatedAt: new Date('2024-10-18T14:30:00Z').toISOString()
    }

    const demoAffiliateCommissions: AffiliateCommission[] = [
      {
        id: 'comm-001',
        affiliateId: 'demo-affiliate-001',
        referralId: 'demo-referral-001',
        subscriptionId: 'demo-subscription-001',
        commissionType: 'subscription_signup',
        baseAmount: 1200000,
        commissionRate: 0.10,
        commissionAmount: 120000,
        currency: 'IDR',
        status: 'completed',
        approvedAt: new Date('2024-10-15T10:00:00Z').toISOString(),
        paidAt: new Date('2024-10-16T09:00:00Z').toISOString(),
        payoutId: 'payout-001',
        createdAt: new Date('2024-10-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-10-16T09:00:00Z').toISOString()
      },
      {
        id: 'comm-002',
        affiliateId: 'demo-affiliate-001',
        referralId: 'demo-referral-002',
        subscriptionId: 'demo-subscription-002',
        commissionType: 'subscription_signup',
        baseAmount: 450000,
        commissionRate: 0.10,
        commissionAmount: 45000,
        currency: 'IDR',
        status: 'pending',
        createdAt: new Date('2024-10-18T14:30:00Z').toISOString(),
        updatedAt: new Date('2024-10-18T14:30:00Z').toISOString()
      },
      {
        id: 'comm-003',
        affiliateId: 'demo-affiliate-001',
        referralId: 'demo-referral-003',
        subscriptionId: 'demo-subscription-003',
        commissionType: 'subscription_renewal',
        baseAmount: 1200000,
        commissionRate: 0.10,
        commissionAmount: 120000,
        currency: 'IDR',
        status: 'approved',
        approvedAt: new Date('2024-10-17T11:00:00Z').toISOString(),
        createdAt: new Date('2024-10-17T11:00:00Z').toISOString(),
        updatedAt: new Date('2024-10-17T11:00:00Z').toISOString()
      }
    ]

    const demoAffiliatePayouts: AffiliatePayout[] = [
      {
        id: 'payout-001',
        affiliateId: 'demo-affiliate-001',
        totalAmount: 900000,
        commissionCount: 8,
        currency: 'IDR',
        status: 'completed',
        processedAt: new Date('2024-10-15T10:00:00Z').toISOString(),
        completedAt: new Date('2024-10-16T09:00:00Z').toISOString(),
        paymentMethod: 'bank_transfer',
        receiptUrl: 'https://example.com/receipt/payout-001',
        createdAt: new Date('2024-10-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-10-16T09:00:00Z').toISOString()
      },
      {
        id: 'payout-002',
        affiliateId: 'demo-affiliate-001',
        totalAmount: 600000,
        commissionCount: 5,
        currency: 'IDR',
        status: 'pending',
        createdAt: new Date('2024-10-20T08:00:00Z').toISOString(),
        updatedAt: new Date('2024-10-20T08:00:00Z').toISOString()
      }
    ]

    setAffiliateProfile(demoAffiliateProfile)
    setAffiliateCommissions(demoAffiliateCommissions)
    setAffiliatePayouts(demoAffiliatePayouts)
  }

  // Filter chatbots based on search
  const filteredChatbots = chatbots.filter(chatbot =>
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chatbot.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Show error state
  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t('dashboard.errorLoading', 'Error Loading Dashboard')}
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t('dashboard.retry', 'Try Again')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {t('dashboard.dashboardTitle', 'Dashboard')}
            </h1>
            <div className="flex gap-6">
              <Button
                variant="ghost"
                onClick={() => document.getElementById('chatbot')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Bot className="mr-2 h-4 w-4" />
                {t('dashboard.chatbotSection', 'Chatbot')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => document.getElementById('account')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <User className="mr-2 h-4 w-4" />
                {t('dashboard.accountSection', 'Akun')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => document.getElementById('billing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {t('dashboard.billingSection', 'Pembayaran')}
              </Button>
              <Button
                variant="ghost"
                onClick={() => document.getElementById('affiliate')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <Gift className="mr-2 h-4 w-4" />
                {t('dashboard.affiliateSection', 'Afiliasi')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl p-12 mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {t('dashboard.welcome', 'Selamat Datang di Platform Chatbot AI 7 Connect')}
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          {t('dashboard.welcomeSubtitle', 'Solusi chatbot AI lengkap untuk layanan pelanggan, keterlibatan, dan otomasi')}
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('dashboard.searchPlaceholder', 'Cari chatbot, fitur, atau pengaturan...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70"
            />
          </div>
        </div>
      </div>

      {/* Subscription Status Card */}
      {subscription && subscription.package && (
        <Card className="mb-8 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {subscription.package?.displayName || 'Unknown Package'}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={subscription.status === 'active' ? 'default' : 'secondary'}
                      className={subscription.status === 'active' ? 'bg-green-600 text-white' : ''}
                    >
                      {subscription.status === 'active' ? 'Aktif' :
                       subscription.status === 'cancelled' ? 'Dibatalkan' :
                       subscription.status === 'expired' ? 'Kadaluarsa' : 'Pending'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {subscription.package?.billingCycle === 'monthly' ? 'Bulanan' :
                       subscription.package?.billingCycle === 'yearly' ? 'Tahunan' : 'Lifetime'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  Rp {subscription.package?.price?.toLocaleString('id-ID') || '0'}
                </div>
                {subscription.nextBillingDate && (
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Tagihan berikutnya: {new Date(subscription.nextBillingDate).toLocaleDateString('id-ID')}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          {usageStats && (
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Chatbot</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {usageStats.chatbots.current}
                    {!usageStats.chatbots.isUnlimited && (
                      <span className="text-sm text-gray-500">/{usageStats.chatbots.limit}</span>
                    )}
                  </div>
                  {!usageStats.chatbots.isUnlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          usageStats.chatbots.percentage > 80 ? 'bg-red-500' :
                          usageStats.chatbots.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usageStats.chatbots.percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Pesan</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {usageStats.messages.current.toLocaleString('id-ID')}
                    {!usageStats.messages.isUnlimited && (
                      <span className="text-sm text-gray-500">/{usageStats.messages.limit?.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                  {!usageStats.messages.isUnlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          usageStats.messages.percentage > 80 ? 'bg-red-500' :
                          usageStats.messages.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usageStats.messages.percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">Dokumen</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {usageStats.knowledgeDocs.current}
                    {!usageStats.knowledgeDocs.isUnlimited && (
                      <span className="text-sm text-gray-500">/{usageStats.knowledgeDocs.limit}</span>
                    )}
                  </div>
                  {!usageStats.knowledgeDocs.isUnlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          usageStats.knowledgeDocs.percentage > 80 ? 'bg-red-500' :
                          usageStats.knowledgeDocs.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usageStats.knowledgeDocs.percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">API Call</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {usageStats.apiCalls.current.toLocaleString('id-ID')}
                    {!usageStats.apiCalls.isUnlimited && (
                      <span className="text-sm text-gray-500">/{usageStats.apiCalls.limit?.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                  {!usageStats.apiCalls.isUnlimited && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${
                          usageStats.apiCalls.percentage > 80 ? 'bg-red-500' :
                          usageStats.apiCalls.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usageStats.apiCalls.percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {subscription.isAutoRenew && subscription.nextBillingDate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-700">
                    <RefreshCw className="h-4 w-4" />
                    <span className="text-sm">
                      Perpanjangan otomatis akan diproses pada {new Date(subscription.nextBillingDate).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Chatbot Section */}
      <section id="chatbot" className="scroll-mt-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Bot className="h-8 w-8 text-green-600" />
                  {t('dashboard.chatbotSection', 'Manajemen Chatbot')}
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {t('dashboard.chatbotSectionDesc', 'Buat dan kelola chatbot AI Anda dengan kepribadian dan basis pengetahuan khusus')}
                </p>
              </div>
              <Button onClick={handleCreateChatbot} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.createNew', 'Buat Baru')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Existing Chatbots */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.existingChatbots', 'Chatbot Anda')}</h3>
              {filteredChatbots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredChatbots.map((chatbot) => (
                    <Card key={chatbot.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">🤖</div>
                            <div>
                              <CardTitle className="text-base">{chatbot.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{chatbot.description}</p>
                            </div>
                          </div>
                          <Badge variant={chatbot.isActive ? 'default' : 'secondary'} className="text-xs">
                            {chatbot.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-gray-600">{t('dashboard.messages', 'Pesan')}</span>
                          <span className="font-medium">{chatbot.stats.totalMessages.toLocaleString()}</span>
                        </div>
                        <Button
                          onClick={() => handleViewChatbot(chatbot.id)}
                          size="sm"
                          className="w-full"
                        >
                          {t('dashboard.manage', 'Kelola')}
                          <ChevronRight className="ml-2 h-3 w-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    {searchQuery ? t('dashboard.noSearchResults', 'Tidak ada chatbot yang cocok dengan pencarian Anda') : t('dashboard.noChatbotsYet', 'Belum ada chatbot')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Account Section */}
      <section id="account" className="scroll-mt-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <User className="h-8 w-8 text-blue-600" />
              {t('dashboard.accountSection', 'Pengaturan Akun')}
            </CardTitle>
            <p className="text-gray-600">
              {t('dashboard.accountSectionDesc', 'Kelola informasi profil dan preferensi Anda')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userData?.name || 'Nama Pengguna'}
                  </h3>
                  <p className="text-gray-600">{userData?.email || 'email@example.com'}</p>
                  <Badge variant="outline" className="mt-2">
                    {userData?.role || 'User'}
                  </Badge>

                  {/* Account Stats */}
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge variant={userData?.isActive ? 'default' : 'secondary'}>
                        {userData?.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Bergabung</span>
                      <span className="font-medium">
                        {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Login Terakhir</span>
                      <span className="font-medium">
                        {userData?.lastLoginAt ? new Date(userData.lastLoginAt).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleAccountSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('dashboard.editProfile', 'Edit Profil')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="account-name">{t('dashboard.fullName', 'Nama Lengkap')}</Label>
                        <Input
                          id="account-name"
                          value={accountForm.name}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder={t('dashboard.namePlaceholder', 'Masukkan nama lengkap Anda')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-email">{t('dashboard.email', 'Email')}</Label>
                        <Input
                          id="account-email"
                          type="email"
                          value={accountForm.email}
                          disabled
                          className="bg-gray-50 cursor-not-allowed"
                          placeholder={t('dashboard.emailPlaceholder', 'Masukkan email Anda')}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {t('dashboard.emailCannotBeChanged', 'Email tidak dapat diubah')}
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="account-phone">{t('dashboard.phone', 'Telepon')}</Label>
                        <Input
                          id="account-phone"
                          value={accountForm.phone}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder={t('dashboard.phonePlaceholder', 'Masukkan nomor telepon Anda')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-company">{t('dashboard.company', 'Perusahaan')}</Label>
                        <Input
                          id="account-company"
                          value={accountForm.company}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, company: e.target.value }))}
                          placeholder={t('dashboard.companyPlaceholder', 'Masukkan nama perusahaan')}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="account-address">{t('dashboard.address', 'Alamat')}</Label>
                        <Input
                          id="account-address"
                          value={accountForm.address}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, address: e.target.value }))}
                          placeholder={t('dashboard.addressPlaceholder', 'Masukkan alamat Anda')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-city">{t('dashboard.city', 'Kota')}</Label>
                        <Input
                          id="account-city"
                          value={accountForm.city}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, city: e.target.value }))}
                          placeholder={t('dashboard.cityPlaceholder', 'Masukkan kota Anda')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="account-country">{t('dashboard.country', 'Negara')}</Label>
                        <Input
                          id="account-country"
                          value={accountForm.country}
                          onChange={(e) => setAccountForm(prev => ({ ...prev, country: e.target.value }))}
                          placeholder={t('dashboard.countryPlaceholder', 'Masukkan negara Anda')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Update Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {t('dashboard.changePassword', 'Ubah Password')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="current-password">{t('dashboard.currentPassword', 'Password Saat Ini')}</Label>
                        <Input
                          id="current-password"
                          type="password"
                          placeholder="Masukkan password saat ini"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">{t('dashboard.newPassword', 'Password Baru')}</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Masukkan password baru"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">{t('dashboard.confirmPassword', 'Konfirmasi Password')}</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Konfirmasi password baru"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4"
                    >
                      {t('dashboard.updatePassword', 'Perbarui Password')}
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t">
                    <Button
                      type="submit"
                      disabled={submittingAccount}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submittingAccount ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <User className="mr-2 h-4 w-4" />
                      )}
                      {t('dashboard.updateAccount', 'Perbarui Akun')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                    >
                      {t('dashboard.cancel', 'Batal')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Payment/Billing Section */}
      <section id="billing" className="scroll-mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-purple-600" />
                  {t('dashboard.billingSection', 'Tagihan & Transaksi')}
                </CardTitle>
                <p className="text-gray-600">
                  {t('dashboard.billingSectionDesc', 'Kelola langganan dan pantau riwayat transaksi Anda')}
                </p>
              </div>
              <Button
                onClick={() => setShowTransactionForm(!showTransactionForm)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.createTransaction', 'Buat Transaksi')}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Current Subscription */}
            {subscription && (
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  {t('dashboard.currentSubscription', 'Langganan Saat Ini')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.planName', 'Nama Paket')}</p>
                    <p className="font-semibold text-lg">{subscription.package?.displayName || subscription.package?.name || 'Unknown Plan'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.status', 'Status')}</p>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                      {subscription.status === 'active' ? 'Aktif' : subscription.status === 'inactive' ? 'Tidak Aktif' : subscription.status === 'cancelled' ? 'Dibatalkan' : 'Kadaluarsa'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.amount', 'Jumlah')}</p>
                    <p className="font-semibold text-lg">Rp {subscription.package?.price?.toLocaleString('id-ID') || 0}/{subscription.package?.billingCycle === 'monthly' ? 'bulan' : 'tahun'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('dashboard.nextBilling', 'Tagihan Berikutnya')}</p>
                    <p className="font-semibold text-lg">
                      {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString('id-ID') : subscription.endDate ? new Date(subscription.endDate).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <p className="text-sm text-gray-600">
                    {t('dashboard.autoRenew', 'Perpanjang Otomatis')}:
                  </p>
                  <Badge variant={subscription.isAutoRenew ? 'default' : 'secondary'}>
                    {subscription.isAutoRenew ? 'Ya' : 'Tidak'}
                  </Badge>
                </div>
              </div>
            )}

            {/* New Transaction Form */}
            {showTransactionForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.createNewTransaction', 'Buat Transaksi Baru')}</h3>
                <form onSubmit={handleTransactionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="transaction-type">{t('dashboard.transactionType', 'Jenis Transaksi')}</Label>
                      <Select
                        value={transactionForm.type}
                        onValueChange={(value: 'subscription' | 'topup') => {
                          setTransactionForm(prev => ({
                            ...prev,
                            type: value,
                            amount: value === 'subscription' ? 1200000 : 750000,
                            description: value === 'subscription' ? 'Buat langganan Pro Plan' : 'Top up saldo'
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subscription">{t('dashboard.subscription', 'Berlangganan')}</SelectItem>
                          <SelectItem value="topup">{t('dashboard.topup', 'Top Up Saldo')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {transactionForm.type === 'subscription' && (
                      <div>
                        <Label htmlFor="plan">{t('dashboard.selectPlan', 'Pilih Paket')}</Label>
                        <Select
                          value={transactionForm.planId}
                          onValueChange={(value) => {
                            const plan = pricingPlans.find(p => p.id === value)
                            setTransactionForm(prev => ({
                              ...prev,
                              planId: value,
                              amount: plan?.price || 0,
                              description: `Buat langganan ${plan?.name || 'Plan'}`
                            }))
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pricingPlans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - Rp {plan.price.toLocaleString('id-ID')}/{plan.interval === 'monthly' ? 'bulan' : 'tahun'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="amount">{t('dashboard.amount', 'Jumlah')}</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={transactionForm.amount}
                        onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        min="1"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">{t('dashboard.description', 'Deskripsi')}</Label>
                      <Textarea
                        id="description"
                        value={transactionForm.description}
                        onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submittingPayment}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {submittingPayment ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                      )}
                      {t('dashboard.processTransaction', 'Proses Transaksi')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTransactionForm(false)}
                    >
                      {t('dashboard.cancel', 'Batal')}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Transaction History */}
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.transactionHistory', 'Riwayat Transaksi')}</h3>
              {transactions.length > 0 ? (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.date', 'Tanggal')}</th>
                          <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.description', 'Deskripsi')}</th>
                          <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.type', 'Jenis')}</th>
                          <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.amount', 'Jumlah')}</th>
                          <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.status', 'Status')}</th>
                          <th className="text-center p-4 font-medium text-gray-900">{t('dashboard.action', 'Aksi')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleViewInvoice(transaction.id)}
                          >
                            <td className="p-4 text-sm">
                              {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="p-4 text-sm">
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                {transaction.subscriptionPlan && (
                                  <p className="text-gray-500 text-xs">{transaction.subscriptionPlan}</p>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-sm">
                              <Badge variant="outline" className="text-xs">
                                {transaction.type === 'subscription' ? 'Berlangganan' :
                                 transaction.type === 'topup' ? 'Top Up' :
                                 transaction.type === 'refund' ? 'Refund' : 'Lainnya'}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm font-medium">
                              Rp {transaction.amount.toLocaleString('id-ID')}
                            </td>
                            <td className="p-4 text-sm">
                              <Badge
                                variant={
                                  transaction.status === 'completed' ? 'default' :
                                  transaction.status === 'pending' ? 'secondary' :
                                  transaction.status === 'failed' ? 'destructive' : 'outline'
                                }
                                className="text-xs"
                              >
                                {transaction.status === 'completed' ? 'Selesai' :
                                 transaction.status === 'pending' ? 'Menunggu' :
                                 transaction.status === 'failed' ? 'Gagal' : 'Dibatalkan'}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-gray-400 hover:text-gray-600">
                                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">{t('dashboard.noTransactions', 'Belum ada transaksi')}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('dashboard.createFirstTransaction', 'Buat transaksi pertama Anda untuk memulai')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Affiliate Section */}
      <section id="affiliate" className="scroll-mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Gift className="h-8 w-8 text-pink-600" />
                  {t('dashboard.affiliateSection', 'Program Afiliasi')}
                </CardTitle>
                <p className="text-gray-600">
                  {t('dashboard.affiliateSectionDesc', 'Dapatkan penghasilan dengan mengajak orang bergabung')}
                </p>
              </div>
              {!affiliateProfile && (
                <Button
                  onClick={() => setShowCreateAffiliateForm(true)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {t('dashboard.joinAffiliate', 'Gabung Afiliasi')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!affiliateProfile ? (
              <div className="text-center py-12">
                <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('dashboard.notAffiliateYet', 'Belum Bergabung Program Afiliasi')}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {t('dashboard.affiliateJoinDesc', 'Bergabunglah dengan program afiliasi kami dan dapatkan komisi dari setiap referral yang berhasil berlangganan')}
                </p>
                <Button
                  onClick={() => setShowCreateAffiliateForm(true)}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Gift className="mr-2 h-4 w-4" />
                  {t('dashboard.joinAffiliateNow', 'Gabung Sekarang')}
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Affiliate Profile Overview */}
                <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Gift className="h-5 w-5 text-pink-600" />
                        {t('dashboard.affiliateProfile', 'Profil Afiliasi Anda')}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={affiliateProfile.isActive ? 'default' : 'secondary'} className="bg-green-600 text-white">
                          {affiliateProfile.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          Kode: <span className="font-mono font-bold">{affiliateProfile.referralCode}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {(affiliateProfile.commissionRate * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {t('dashboard.commissionRate', 'Rate Komisi')}
                      </div>
                    </div>
                  </div>

                  {/* Referral Link */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        {t('dashboard.referralLink', 'Link Referral Anda')}
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={affiliateProfile.referralLink}
                          readOnly
                          className="bg-white/80 backdrop-blur-sm"
                        />
                        <Button
                          onClick={handleCopyReferralLink}
                          variant="outline"
                          className="flex-shrink-0"
                        >
                          {copySuccess ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Share2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affiliate Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">
                            {t('dashboard.totalReferrals', 'Total Referral')}
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {affiliateProfile.totalReferrals}
                          </p>
                        </div>
                        <Users2 className="h-8 w-8 text-blue-600 opacity-50" />
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        {affiliateProfile.activeReferrals} aktif
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">
                            {t('dashboard.totalEarnings', 'Total Penghasilan')}
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            Rp {affiliateProfile.totalCommissions.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        Dari {affiliateProfile.totalPayouts} pembayaran
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">
                            {t('dashboard.pendingCommissions', 'Komisi Pending')}
                          </p>
                          <p className="text-2xl font-bold text-yellow-900">
                            Rp {affiliateProfile.pendingCommissions.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600 opacity-50" />
                      </div>
                      <div className="text-xs text-yellow-700 mt-1">
                        Menunggu konfirmasi
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">
                            {t('dashboard.paidCommissions', 'Sudah Dibayar')}
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            Rp {affiliateProfile.paidCommissions.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-purple-600 opacity-50" />
                      </div>
                      {affiliateProfile.lastPayoutAt && (
                        <div className="text-xs text-purple-700 mt-1">
                          Terakhir: {new Date(affiliateProfile.lastPayoutAt).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                {affiliateProfile.pendingCommissions > 0 && (
                  <div className="flex justify-center">
                    <Button
                      onClick={handleRequestPayout}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t('dashboard.requestPayout', 'Ajukan Pencairan')}
                      Rp {affiliateProfile.pendingCommissions.toLocaleString('id-ID')}
                    </Button>
                  </div>
                )}

                {/* Commissions History */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    {t('dashboard.commissionHistory', 'Riwayat Komisi')}
                  </h3>
                  {affiliateCommissions.length > 0 ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.date', 'Tanggal')}</th>
                              <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.type', 'Jenis')}</th>
                              <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.amount', 'Jumlah')}</th>
                              <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.commission', 'Komisi')}</th>
                              <th className="text-left p-4 font-medium text-gray-900">{t('dashboard.status', 'Status')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {affiliateCommissions.map((commission) => (
                              <tr key={commission.id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm">
                                  {new Date(commission.createdAt).toLocaleDateString('id-ID')}
                                </td>
                                <td className="p-4 text-sm">
                                  <Badge variant="outline" className="text-xs">
                                    {commission.commissionType === 'subscription_signup' ? 'Pendaftaran' :
                                     commission.commissionType === 'subscription_renewal' ? 'Perpanjangan' : 'Lainnya'}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm font-medium">
                                  Rp {commission.baseAmount.toLocaleString('id-ID')}
                                </td>
                                <td className="p-4 text-sm font-medium text-green-600">
                                  Rp {commission.commissionAmount.toLocaleString('id-ID')}
                                </td>
                                <td className="p-4 text-sm">
                                  <Badge
                                    variant={
                                      commission.status === 'completed' ? 'default' :
                                      commission.status === 'pending' ? 'secondary' :
                                      commission.status === 'approved' ? 'default' :
                                      commission.status === 'rejected' ? 'destructive' : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {commission.status === 'completed' ? 'Selesai' :
                                     commission.status === 'pending' ? 'Menunggu' :
                                     commission.status === 'approved' ? 'Disetujui' :
                                     commission.status === 'rejected' ? 'Ditolak' : 'Lainnya'}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">{t('dashboard.noCommissions', 'Belum ada komisi')}</p>
                    </div>
                  )}
                </div>

                {/* Payouts History */}
                {affiliatePayouts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t('dashboard.payoutHistory', 'Riwayat Pencairan')}
                    </h3>
                    <div className="space-y-3">
                      {affiliatePayouts.map((payout) => (
                        <div key={payout.id} className="p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                Rp {payout.totalAmount.toLocaleString('id-ID')}
                              </div>
                              <div className="text-sm text-gray-600">
                                {payout.commissionCount} komisi • {payout.paymentMethod || 'Bank Transfer'}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  payout.status === 'completed' ? 'default' :
                                  payout.status === 'pending' ? 'secondary' :
                                  payout.status === 'failed' ? 'destructive' : 'outline'
                                }
                                className="text-xs"
                              >
                                {payout.status === 'completed' ? 'Selesai' :
                                 payout.status === 'pending' ? 'Menunggu' :
                                 payout.status === 'failed' ? 'Gagal' : 'Lainnya'}
                              </Badge>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(payout.createdAt).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create Affiliate Form */}
            {showCreateAffiliateForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {t('dashboard.createAffiliateProfile', 'Buat Profil Afiliasi')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('dashboard.createAffiliateDesc', 'Dapatkan komisi 10% dari setiap referral yang berhasil berlangganan')}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreateAffiliateProfile}
                      className="bg-pink-600 hover:bg-pink-700"
                    >
                      <Gift className="mr-2 h-4 w-4" />
                      {t('dashboard.createAffiliate', 'Buat Sekarang')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateAffiliateForm(false)}
                    >
                      {t('dashboard.cancel', 'Batal')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}