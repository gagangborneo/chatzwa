'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import {
  Shield,
  Users,
  Cpu,
  CreditCard,
  Settings,
  BarChart3,
  Database,
  UserCog,
  Bot,
  TrendingUp,
  FileText,
  AlertTriangle,
  CheckCircle,
  DollarSign
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
import LanguageDropdown from '@/components/dashboard/language-dropdown'

const adminManagementItems = [
  {
    titleKey: 'admin.nav.userManagement',
    icon: Users,
    href: '/admin/dashboard/users',
  },
  {
    titleKey: 'admin.nav.aiModelManagement',
    icon: Bot,
    href: '/admin/dashboard/ai-models',
  },
  {
    titleKey: 'admin.nav.transactionManagement',
    icon: CreditCard,
    href: '/admin/dashboard/transactions',
  },
  {
    titleKey: 'admin.nav.pricingManagement',
    icon: DollarSign,
    href: '/admin/dashboard/pricing',
  },
  {
    titleKey: 'admin.nav.systemSettings',
    icon: Settings,
    href: '/admin/dashboard/settings',
  },
]

const adminAnalyticsItems = [
  {
    titleKey: 'admin.nav.systemAnalytics',
    icon: BarChart3,
    href: '/admin/dashboard/analytics',
  },
  {
    titleKey: 'admin.nav.userActivity',
    icon: TrendingUp,
    href: '/admin/dashboard/user-activity',
  },
  {
    titleKey: 'admin.nav.systemHealth',
    icon: Shield,
    href: '/admin/dashboard/system-health',
  },
]

const adminSystemItems = [
  {
    titleKey: 'admin.nav.database',
    icon: Database,
    href: '/admin/dashboard/database',
  },
  {
    titleKey: 'admin.nav.systemLogs',
    icon: FileText,
    href: '/admin/dashboard/logs',
  },
  {
    titleKey: 'admin.nav.security',
    icon: Shield,
    href: '/admin/dashboard/security',
  },
]

interface AdminSidebarProps {
  children: React.ReactNode
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const { t } = useI18n()
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState('Admin Dashboard')

  // Update active item based on current pathname
  useEffect(() => {
    // Check if main admin dashboard
    if (pathname === '/admin/dashboard') {
      setActiveItem(t('admin.nav.dashboard'))
      return
    }

    const allNavItems = [...adminManagementItems, ...adminAnalyticsItems, ...adminSystemItems]
    const activeNav = allNavItems.find(item => pathname.startsWith(item.href))

    if (activeNav) {
      setActiveItem(t(activeNav.titleKey))
    }
  }, [pathname, t])

  return (
    <SidebarProvider>
      <Sidebar className="border-gray-700">
        <SidebarHeader className="border-b border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-800">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{t('admin.dashboard.title')}</span>
              <span className="text-xs text-gray-400">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-gray-900">
          {/* Dashboard - Menu Utama */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem === t('admin.nav.dashboard')}
                    onClick={() => setActiveItem(t('admin.nav.dashboard'))}
                    className="hover:bg-gray-800 data-[active=true]:bg-gray-800 data-[active=true]:text-white text-gray-300"
                  >
                    <a href="/admin/dashboard" className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4" />
                      <span>{t('admin.nav.dashboard')}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Management */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs font-semibold">
              {t('admin.dashboard.management')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminManagementItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-gray-800 data-[active=true]:bg-gray-800 data-[active=true]:text-white text-gray-300"
                    >
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Analytics */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs font-semibold">
              {t('admin.dashboard.analytics')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminAnalyticsItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-gray-800 data-[active=true]:bg-gray-800 data-[active=true]:text-white text-gray-300"
                    >
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* System */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400 text-xs font-semibold">
              {t('admin.dashboard.system')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminSystemItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-gray-800 data-[active=true]:bg-gray-800 data-[active=true]:text-white text-gray-300"
                    >
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{t(item.titleKey)}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-700 bg-gray-900">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-900">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white">{t('admin.dashboard.systemOnline')}</span>
              <span className="text-xs text-gray-400">{t('admin.dashboard.allOperational')}</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{t('admin.dashboard.title')}</h1>
              <p className="text-sm text-gray-500">{t('admin.dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600">Admin</span>
              </div>
              <LanguageDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}