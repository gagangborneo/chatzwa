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
  Facebook,
  CreditCard,
  LogOut,
  User,
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
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LanguageDropdown from './language-dropdown'

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
  {
    titleKey: 'nav.instagram',
    icon: MessageCircle,
    href: '/dashboard/integrations/instagram',
    isComingSoon: true,
  },
  {
    titleKey: 'nav.facebook',
    icon: Facebook,
    href: '/dashboard/integrations/facebook',
    isComingSoon: true,
  },
]

interface DashboardSidebarProps {
  children: React.ReactNode
}

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const { t } = useI18n()
  const pathname = usePathname()
  const router = useRouter()
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [chatbotName, setChatbotName] = useState('Customer Support Assistant')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Extract chatbot ID from pathname
  const chatbotId = pathname.split('/')[3] || ''

  // Update active item based on current pathname
  useEffect(() => {
    // Check if main dashboard
    if (pathname === '/dashboard') {
      setActiveItem(t('nav.dashboard'))
      return
    }

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
  
  // // Update active item based on current pathname
  // useEffect(() => {
  //   // Check if main dashboard
  //   if (pathname === '/dashboard') {
  //     setActiveItem(t('nav.dashboard'))
  //     return
  //   }

  //   const allNavItems = [...chatbotItems, ...managementItems, ...integrationItems]
  //   const activeNav = allNavItems.find(item => pathname.startsWith(item.href))

  //   if (activeNav) {
  //     setActiveItem(t(activeNav.titleKey))
  //   }
  // }, [pathname, t])

  // Fetch user data with caching to avoid repeated API calls
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
        // Fallback to default user - this should not happen since middleware protects routes
        setUser({ name: 'Admin', email: 'admin@admin.com' })
      }
    }

    // Only fetch user data if not already loaded
    if (!user) {
      fetchUser()
    }
  }, [])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        // Clear any client-side storage and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
          sessionStorage.removeItem('auth-token')
        }
        router.push('/login')
      } else {
        console.error('Logout failed:', result.error)
        // Even if API call fails, try to redirect to login for better UX
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Even if fetch fails, try to redirect to login for better UX
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2 px-2 py-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="p-1 h-auto"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-gray-900 truncate">{chatbotName}</span>
              <span className="text-xs text-gray-500 truncate">Chatbot AI</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Dashboard */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === t('nav.dashboard')}
                    onClick={() => setActiveItem(t('nav.dashboard'))}
                    className="hover:bg-slate-50 data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900"
                  >
                    <a href={`/dashboard/chatbot/${chatbotId}`} className="flex items-center gap-3 min-w-0">
                      <BarChart3 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{t('nav.dashboard')}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Chatbot AI */}
          <SidebarGroup>
            <SidebarGroupLabel>{t('dashboard.chatbotAI')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatbotItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-slate-50 data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900"
                    >
                      <a href={item.href.replace('[id]', chatbotId)} className="flex items-center gap-3 min-w-0">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{t(item.titleKey)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Integrations */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              {t('dashboard.integrations')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {integrationItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-slate-50 data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900"
                    >
                      <a href={item.href.replace('[id]', chatbotId)} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Management */}
          <SidebarGroup>
            <SidebarGroupLabel>{t('dashboard.management')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-slate-50 data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900"
                    >
                      <a href={item.href.replace('[id]', chatbotId)} className="flex items-center gap-3 min-w-0">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{t(item.titleKey)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-900">{t('dashboard.systemOnline')}</span>
              <span className="text-xs text-gray-500">{t('dashboard.allOperational')}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger className="-ml-1 lg:hidden" />
          <div className="flex flex-1 items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 truncate">{t('dashboard.title')}</h1>
              <p className="text-sm text-gray-500 hidden sm:block">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3 ml-2">
              {/* Status */}
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>

              {/* Language Dropdown */}
              <LanguageDropdown />

              {/* Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-slate-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                      <User className="h-3 w-3 text-slate-600" />
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-900">{user?.name || 'Admin'}</span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 border-b">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</span>
                        <span className="text-xs text-gray-500">{user?.email || 'admin@admin.com'}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/account')}
                    className="cursor-pointer"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>{t('nav.account')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/settings')}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('nav.settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('account.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 overflow-x-hidden">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}