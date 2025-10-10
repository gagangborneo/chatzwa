'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import {
  BarChart3,
  MessageSquare,
  Database,
  TrendingUp,
  Settings,
  Users,
  FileText,
  Cpu,
  Plug,
  Smartphone,
  Globe,
  MessageCircle,
  Facebook
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
import LanguageDropdown from './language-dropdown'

const navigationItems = [
  {
    titleKey: 'nav.dashboard',
    icon: BarChart3,
    href: '/dashboard',
    isActive: true
  },
  {
    titleKey: 'nav.chatAnalytics',
    icon: MessageSquare,
    href: '/dashboard/chat',
  },
  {
    titleKey: 'nav.knowledgeBase',
    icon: Database,
    href: '/dashboard/knowledge',
  },
  {
    titleKey: 'nav.tokenUsage',
    icon: TrendingUp,
    href: '/dashboard/tokens',
  },
]

const managementItems = [
  {
    titleKey: 'nav.users',
    icon: Users,
    href: '/dashboard/users',
  },
  {
    titleKey: 'nav.documents',
    icon: FileText,
    href: '/dashboard/documents',
  },
  {
    titleKey: 'nav.aiModels',
    icon: Cpu,
    href: '/dashboard/models',
  },
  {
    titleKey: 'nav.settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

const integrationItems = [
  {
    titleKey: 'nav.whatsapp',
    icon: Smartphone,
    href: '/dashboard/integrations/whatsapp',
  },
  {
    titleKey: 'nav.wordpress',
    icon: Globe,
    href: '/dashboard/integrations/wordpress',
  },
  {
    titleKey: 'nav.embedChat',
    icon: MessageCircle,
    href: '/dashboard/integrations/embed-chat',
  },
  {
    titleKey: 'nav.instagram',
    icon: MessageCircle,
    href: '/dashboard/integrations/instagram',
  },
  {
    titleKey: 'nav.facebook',
    icon: Facebook,
    href: '/dashboard/integrations/facebook',
  },
]

interface DashboardSidebarProps {
  children: React.ReactNode
}

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const { t } = useI18n()
  const [activeItem, setActiveItem] = useState('Dashboard')

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-gray-200">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-600 to-slate-800">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{t('dashboard.title')}</span>
              <span className="text-xs text-gray-500">Analytics Hub</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t('dashboard.analytics')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.titleKey}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeItem === t(item.titleKey)}
                      onClick={() => setActiveItem(t(item.titleKey))}
                      className="hover:bg-slate-50 data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900"
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

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Plug className="h-4 w-4" />
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

        <SidebarFooter className="border-t border-gray-200">
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
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
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{t('dashboard.title')}</h1>
              <p className="text-sm text-gray-500">{t('dashboard.subtitle')}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Live</span>
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