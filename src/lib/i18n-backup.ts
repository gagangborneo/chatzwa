'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'id' | 'en'

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  id: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Real-time analytics dan insights untuk AI assistant Anda',
    'dashboard.analytics': 'Analytics',
    'dashboard.management': 'Management',
    'dashboard.systemOnline': 'Sistem Online',
    'dashboard.allOperational': 'Semua layanan operasional',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chatAnalytics': 'Analitik Chat',
    'nav.knowledgeBase': 'Knowledge Base',
    'nav.tokenUsage': 'Token Usage',
    'nav.users': 'Pengguna',
    'nav.documents': 'Dokumen',
    'nav.aiModels': 'AI Models',
    'nav.settings': 'Pengaturan',

    // Stats Cards
    'stats.totalChats': 'Total Chat',
    'stats.conversationsMonth': 'Percakapan bulan ini',
    'stats.knowledgeBase': 'Knowledge Base',
    'stats.documentsIndexed': 'Dokumen terindeks',
    'stats.tokenUsage': 'Token Usage',
    'stats.tokensProcessed': 'Token diproses',
    'stats.activeUsers': 'Pengguna Aktif',
    'stats.uniqueUsersToday': 'Pengguna unik hari ini',
    'stats.avgResponseTime': 'Avg Response Time',
    'stats.avgAiResponse': 'Waktu respons AI rata-rata',
    'stats.documentsProcessed': 'Documents Processed',
    'stats.newDocumentsWeek': 'Dokumen baru minggu ini',
    'stats.systemHealth': 'System Health',
    'stats.uptimeMonth': 'Uptime bulan ini',

    // Charts
    'charts.chatVolumeToken': 'Chat Volume & Token Usage',
    'charts.tokenUsageTrend': 'Token Usage Trend',
    'charts.knowledgeBaseDistribution': 'Knowledge Base Distribution',
    'charts.performanceMetrics': 'Performance Metrics',

    // Actions
    'actions.filter': 'Filter',
    'actions.export': 'Export',
    'actions.refresh': 'Refresh',
    'actions.viewFullDashboard': 'Lihat Dashboard Lengkap',

    // Activity
    'activity.recentActivity': 'Aktivitas Terkini',
    'activity.newDocumentsAdded': 'Dokumen baru ditambahkan',
    'activity.knowledgeBaseUpdated': 'Knowledge base diperbarui',
    'activity.systemMaintenance': 'Maintenance sistem',
    'activity.userReportsProcessed': 'Laporan pengguna diproses',

    // System Status
    'status.systemStatus': 'Status Sistem',
    'status.aiService': 'AI Service',
    'status.database': 'Database',
    'status.apiGateway': 'API Gateway',
    'status.operational': 'Operational',
    'status.degraded': 'Degraded',
    'status.uptime': 'uptime',

    // Knowledge Base Categories
    'knowledge.islamicStudies': 'Islamic Studies',
    'knowledge.education': 'Education',
    'knowledge.donationPrograms': 'Donation Programs',
    'knowledge.quranLearning': 'Quran Learning',
    'knowledge.general': 'General',

    // Chat Interface
    'chat.title': 'Attallah Assistant',
    'chat.subtitle': 'Yayasan Pendidikan Islam • Online',
    'chat.welcome': 'Assalamualaikum! Saya adalah Attallah, asisten digital Yayasan Pendidikan Islam. Saya siap membantu Anda seputar informasi program pendidikan, transaksi, data, kajian, program donasi, dan ilmu Al-Quran. Ada yang bisa saya bantu? 🌟',
    'chat.inputPlaceholder': 'Ketik pesan Anda... ✨',
    'chat.sendInstructions': 'Tekan Enter untuk mengirim • Shift+Enter untuk baris baru',
    'chat.typing': 'Mengetik respons...',
    'chat.errorMessage': 'Maaf, terjadi kesalahan. Silakan coba lagi. ⚠️',
    'chat.tooLong': 'Pesan terlalu panjang! Maksimal {{max}} karakter.',
    'chat.characterCount': '{{current}}/{{max}}',

    // Language
    'language.indonesian': 'Bahasa Indonesia',
    'language.english': 'English',
    'language.current': 'Saat ini',
  },
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Real-time analytics and insights for your AI assistant',
    'dashboard.analytics': 'Analytics',
    'dashboard.management': 'Management',
    'dashboard.systemOnline': 'System Online',
    'dashboard.allOperational': 'All services operational',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.chatAnalytics': 'Chat Analytics',
    'nav.knowledgeBase': 'Knowledge Base',
    'nav.tokenUsage': 'Token Usage',
    'nav.users': 'Users',
    'nav.documents': 'Documents',
    'nav.aiModels': 'AI Models',
    'nav.settings': 'Settings',

    // Stats Cards
    'stats.totalChats': 'Total Chats',
    'stats.conversationsMonth': 'Conversations this month',
    'stats.knowledgeBase': 'Knowledge Base',
    'stats.documentsIndexed': 'Documents indexed',
    'stats.tokenUsage': 'Token Usage',
    'stats.tokensProcessed': 'Tokens processed',
    'stats.activeUsers': 'Active Users',
    'stats.uniqueUsersToday': 'Unique users today',
    'stats.avgResponseTime': 'Avg Response Time',
    'stats.avgAiResponse': 'Average AI response time',
    'stats.documentsProcessed': 'Documents Processed',
    'stats.newDocumentsWeek': 'New documents this week',
    'stats.systemHealth': 'System Health',
    'stats.uptimeMonth': 'Uptime this month',

    // Charts
    'charts.chatVolumeToken': 'Chat Volume & Token Usage',
    'charts.tokenUsageTrend': 'Token Usage Trend',
    'charts.knowledgeBaseDistribution': 'Knowledge Base Distribution',
    'charts.performanceMetrics': 'Performance Metrics',

    // Actions
    'actions.filter': 'Filter',
    'actions.export': 'Export',
    'actions.refresh': 'Refresh',
    'actions.viewFullDashboard': 'View Full Dashboard',

    // Activity
    'activity.recentActivity': 'Recent Activity',
    'activity.newDocumentsAdded': 'New documents added',
    'activity.knowledgeBaseUpdated': 'Knowledge base updated',
    'activity.systemMaintenance': 'System maintenance',
    'activity.userReportsProcessed': 'User reports processed',

    // System Status
    'status.systemStatus': 'System Status',
    'status.aiService': 'AI Service',
    'status.database': 'Database',
    'status.apiGateway': 'API Gateway',
    'status.operational': 'Operational',
    'status.degraded': 'Degraded',
    'status.uptime': 'uptime',

    // Knowledge Base Categories
    'knowledge.islamicStudies': 'Islamic Studies',
    'knowledge.education': 'Education',
    'knowledge.donationPrograms': 'Donation Programs',
    'knowledge.quranLearning': 'Quran Learning',
    'knowledge.general': 'General',

    // Chat Interface
    'chat.title': 'Attallah Assistant',
    'chat.subtitle': 'Islamic Education Foundation • Online',
    'chat.welcome': 'Assalamualaikum! I am Attallah, the digital assistant for Islamic Education Foundation. I am ready to help you with information about education programs, transactions, data, studies, donation programs, and Quranic knowledge. How can I assist you? 🌟',
    'chat.inputPlaceholder': 'Type your message... ✨',
    'chat.sendInstructions': 'Press Enter to send • Shift+Enter for new line',
    'chat.typing': 'Typing response...',
    'chat.errorMessage': 'Sorry, an error occurred. Please try again. ⚠️',
    'chat.tooLong': 'Message too long! Maximum {{max}} characters.',
    'chat.characterCount': '{{current}}/{{max}}',

    // Language
    'language.indonesian': 'Bahasa Indonesia',
    'language.english': 'English',
    'language.current': 'Current',
  }
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['id', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[language]?.[key] || key

    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value))
      })
    }

    return translation
  }

  const providerValue = { language, setLanguage: changeLanguage, t } as I18nContextType

  return (
    <I18nContext.Provider value={providerValue}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}