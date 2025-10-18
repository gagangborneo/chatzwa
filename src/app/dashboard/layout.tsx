'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  User,
  ChevronDown,
  LogOut,
  CreditCard,
  Settings,
  Plus,
  Bot,
  Users,
} from 'lucide-react'
import LanguageDropdown from '@/components/dashboard/language-dropdown'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { t } = useI18n()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // Check if this is a main dashboard page (without sidebar)
  const isMainDashboard = pathname === '/dashboard' || pathname === '/dashboard/chatbots/create' || pathname.startsWith('/dashboard/invoice/')

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
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token')
          sessionStorage.removeItem('auth-token')
        }
        router.push('/login')
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Use simple layout for main dashboard, sidebar layout for chatbot dashboards
  if (isMainDashboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Simple Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-600 to-emerald-600">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-gray-900">Chatbot AI Platform</h1>
                  <p className="text-xs text-gray-500">7 Connect</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Language Dropdown */}
                <LanguageDropdown />

                {/* Account Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-3 w-3 text-slate-600" />
                      </div>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-xs font-medium text-gray-900">{user?.name || 'Admin'}</span>
                        <span className="text-xs text-gray-500">{t('account.online', 'Online')}</span>
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
                    <DropdownMenuItem
                      onClick={() => router.push('/dashboard/billing')}
                      className="cursor-pointer"
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>{t('nav.billing')}</span>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    )
  }

  // Use sidebar layout for chatbot-specific pages
  return <ChatbotDashboardLayout>{children}</ChatbotDashboardLayout>
}

// Separate layout for chatbot-specific dashboards with sidebar
function ChatbotDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardSidebar>{children}</DashboardSidebar>
}

// Import the sidebar component for chatbot dashboards
import DashboardSidebar from '@/components/dashboard/sidebar'