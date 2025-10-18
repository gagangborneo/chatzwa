'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import {
  BarChart3,
  MessageSquare,
  Database,
  RefreshCw,
  Settings,
  Users,
  FileText,
  Cpu,
  Plug,
  Smartphone,
  Globe,
  MessageCircle,
  ChevronDown,
  Bot,
  ArrowLeft,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LanguageDropdown from '@/components/dashboard/language-dropdown'

const chatbotItems = [
  {
    titleKey: 'nav.chatAnalytics',
    icon: MessageSquare,
    href: '/dashboard/chatbot/[id]/analytics',
  },
  {
    titleKey: 'nav.persona',
    icon: Cpu,
    href: '/dashboard/chatbot/[id]/persona',
  },
  {
    titleKey: 'nav.knowledgeBase',
    icon: Database,
    href: '/dashboard/chatbot/[id]/knowledge',
  },
  {
    titleKey: 'nav.dataSync',
    icon: RefreshCw,
    href: '/dashboard/chatbot/[id]/sync',
  },
]

const managementItems = [
  {
    titleKey: 'nav.settings',
    icon: Settings,
    href: '/dashboard/chatbot/[id]/settings',
  },
]

const integrationItems = [
  {
    titleKey: 'nav.whatsapp',
    icon: Smartphone,
    href: '/dashboard/chatbot/[id]/integrations/whatsapp',
  },
  {
    titleKey: 'nav.wordpress',
    icon: Globe,
    href: '/dashboard/chatbot/[id]/integrations/wordpress',
  },
  {
    titleKey: 'nav.embedChat',
    icon: MessageCircle,
    href: '/dashboard/chatbot/[id]/integrations/embed-chat',
  },
]

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatbotLayoutClient>
      {children}
    </ChatbotLayoutClient>
  )
}

function ChatbotLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [chatbotName, setChatbotName] = useState('Customer Support Assistant')
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Extract chatbot ID from pathname
  const chatbotId = pathname.split('/')[3] || ''

  // Update active item based on current pathname
  useEffect(() => {
    const allNavItems = [...chatbotItems, ...managementItems, ...integrationItems]
    const activeNav = allNavItems.find(item => {
      const href = item.href.replace('[id]', chatbotId)
      return pathname.startsWith(href)
    })

    if (activeNav) {
      setActiveItem(t(activeNav.titleKey))
    } else if (pathname === `/dashboard/chatbot/${chatbotId}`) {
      setActiveItem(t('nav.dashboard'))
    }
  }, [pathname, chatbotId, t])

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data?.user) {
            setUser({
              name: result.data.user.name || 'Admin',
              email: result.data.user.email
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setUser({ name: 'Admin', email: 'admin@admin.com' })
      }
    }

    if (!user) {
      fetchUser()
    }
  }, [])

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <main className="flex-1 bg-gray-50 overflow-x-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}