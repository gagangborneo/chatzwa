'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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
    'dashboard.integrations': 'Integrations',
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
    'nav.whatsapp': 'WhatsApp',
    'nav.wordpress': 'WordPress',
    'nav.embedChat': 'Embed Chat',
    'nav.instagram': 'Instagram',
    'nav.facebook': 'Facebook',

    // Chat Analytics
    'chatAnalytics.subtitle': 'Monitor real-time chat performance and user interactions',
    'metrics.totalChats': 'Total Chats',
    'metrics.activeUsers': 'Active Users',
    'metrics.avgResponseTime': 'Avg Response Time',
    'metrics.satisfaction': 'Satisfaction Rate',
    'tabs.overview': 'Overview',
    'tabs.trends': 'Trends',
    'tabs.conversations': 'Conversations',
    'tabs.performance': 'Performance',
    'status.completed': 'Selesai',
    'status.active': 'Aktif',
    'status.error': 'Error',
    'chatAnalytics.recentConversations': 'Percakapan Terkini',
    'chatAnalytics.searchPlaceholder': 'Cari percakapan...',
    'chatAnalytics.user': 'Pengguna',
    'chatAnalytics.message': 'Pesan',
    'chatAnalytics.time': 'Waktu',
    'chatAnalytics.duration': 'Durasi',
    'chatAnalytics.status': 'Status',
    'chatAnalytics.hourlyStats': 'Statistik Per Jam',
    'chatAnalytics.chats': 'Chat',
    'chatAnalytics.avgResponse': 'Rata-rata Response',

    // Knowledge Base
    'knowledge.subtitle': 'Manage and monitor your AI knowledge base and document indexing',
    'knowledge.totalDocuments': 'Total Documents',
    'knowledge.indexedDocuments': 'Indexed Documents',
    'knowledge.totalEmbeddings': 'Total Embeddings',
    'knowledge.storageUsed': 'Storage Used',
    'knowledge.categories': 'Categories',
    'knowledge.lastUpdated': 'Last Updated',
    'knowledge.categoryDistribution': 'Distribusi Kategori',
    'knowledge.documentManagement': 'Manajemen Dokumen',
    'knowledge.searchDocuments': 'Cari dokumen...',
    'knowledge.documentTitle': 'Judul Dokumen',
    'knowledge.category': 'Kategori',
    'knowledge.author': 'Penulis',
    'knowledge.size': 'Ukuran',
    'knowledge.status': 'Status',
    'knowledge.views': 'Dilihat',
    'knowledge.actions': 'Aksi',
    'knowledge.uploadDocument': 'Upload Dokumen',
    'knowledge.addCategory': 'Tambah Kategori',
    'knowledge.categoryManagement': 'Manajemen Kategori',
    'knowledge.recentActivity': 'Aktivitas Terkini',
    'knowledge.knowledgeData': 'Data Pengetahuan',
    'knowledge.uploadFiles': 'Upload File',
    'knowledge.allCategories': 'Semua Kategori',
    'knowledge.embeddings': 'Embeddings',
    'knowledge.recentIndexing': 'Indeks Terkini',
    'knowledge.fileUpload': 'Upload File',
    'knowledge.dragDropFiles': 'Seret dan lepas file di sini',
    'knowledge.supportedFormats': 'Format yang didukung',
    'knowledge.uploading': 'Mengupload',
    'knowledge.selectFiles': 'Pilih File',
    'knowledge.uploadProgress': 'Progress Upload',
    'knowledge.processingFiles': 'Memproses file',
    'knowledge.uploadDescription': 'File sedang diupload dan diproses untuk indexing',
    'knowledge.batchUploadOptions': 'Opsi Upload Batch',
    'knowledge.defaultCategory': 'Kategori Default',
    'knowledge.autoIndexing': 'Auto Indexing',
    'knowledge.autoIndexingDescription': 'Otomatis index file setelah upload',
    'knowledge.description': 'Deskripsi',
    'knowledge.descriptionPlaceholder': 'Tambahkan deskripsi untuk file yang diupload...',
    'knowledge.supportedFileTypes': 'Tipe File yang Didukung',
    'status.indexed': 'Terindeks',
    'status.processing': 'Diproses',
    'status.failed': 'Gagal',

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
    'dashboard.integrations': 'Integrations',
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
    'nav.whatsapp': 'WhatsApp',
    'nav.wordpress': 'WordPress',
    'nav.embedChat': 'Embed Chat',
    'nav.instagram': 'Instagram',
    'nav.facebook': 'Facebook',

    // Chat Analytics
    'chatAnalytics.subtitle': 'Monitor real-time chat performance and user interactions',
    'metrics.totalChats': 'Total Chats',
    'metrics.activeUsers': 'Active Users',
    'metrics.avgResponseTime': 'Avg Response Time',
    'metrics.satisfaction': 'Satisfaction Rate',
    'tabs.overview': 'Overview',
    'tabs.trends': 'Trends',
    'tabs.conversations': 'Conversations',
    'tabs.performance': 'Performance',
    'status.completed': 'Completed',
    'status.active': 'Active',
    'status.error': 'Error',
    'chatAnalytics.recentConversations': 'Recent Conversations',
    'chatAnalytics.searchPlaceholder': 'Search conversations...',
    'chatAnalytics.user': 'User',
    'chatAnalytics.message': 'Message',
    'chatAnalytics.time': 'Time',
    'chatAnalytics.duration': 'Duration',
    'chatAnalytics.status': 'Status',
    'chatAnalytics.hourlyStats': 'Hourly Statistics',
    'chatAnalytics.chats': 'Chats',
    'chatAnalytics.avgResponse': 'Avg Response',

    // Knowledge Base
    'knowledge.subtitle': 'Manage and monitor your AI knowledge base and document indexing',
    'knowledge.totalDocuments': 'Total Documents',
    'knowledge.indexedDocuments': 'Indexed Documents',
    'knowledge.totalEmbeddings': 'Total Embeddings',
    'knowledge.storageUsed': 'Storage Used',
    'knowledge.categories': 'Categories',
    'knowledge.lastUpdated': 'Last Updated',
    'knowledge.categoryDistribution': 'Category Distribution',
    'knowledge.documentManagement': 'Document Management',
    'knowledge.searchDocuments': 'Search documents...',
    'knowledge.documentTitle': 'Document Title',
    'knowledge.category': 'Category',
    'knowledge.author': 'Author',
    'knowledge.size': 'Size',
    'knowledge.status': 'Status',
    'knowledge.views': 'Views',
    'knowledge.actions': 'Actions',
    'knowledge.uploadDocument': 'Upload Document',
    'knowledge.addCategory': 'Add Category',
    'knowledge.categoryManagement': 'Category Management',
    'knowledge.recentActivity': 'Recent Activity',
    'knowledge.knowledgeData': 'Knowledge Data',
    'knowledge.uploadFiles': 'Upload Files',
    'knowledge.allCategories': 'All Categories',
    'knowledge.embeddings': 'Embeddings',
    'knowledge.recentIndexing': 'Recent Indexing',
    'knowledge.fileUpload': 'File Upload',
    'knowledge.dragDropFiles': 'Drag and drop files here',
    'knowledge.supportedFormats': 'Supported formats',
    'knowledge.uploading': 'Uploading',
    'knowledge.selectFiles': 'Select Files',
    'knowledge.uploadProgress': 'Upload Progress',
    'knowledge.processingFiles': 'Processing files',
    'knowledge.uploadDescription': 'Files are being uploaded and processed for indexing',
    'knowledge.batchUploadOptions': 'Batch Upload Options',
    'knowledge.defaultCategory': 'Default Category',
    'knowledge.autoIndexing': 'Auto Indexing',
    'knowledge.autoIndexingDescription': 'Automatically index files after upload',
    'knowledge.description': 'Description',
    'knowledge.descriptionPlaceholder': 'Add description for uploaded files...',
    'knowledge.supportedFileTypes': 'Supported File Types',
    'status.indexed': 'Indexed',
    'status.processing': 'Processing',
    'status.failed': 'Failed',

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

  const contextValue: I18nContextType = {
    language,
    setLanguage: changeLanguage,
    t
  }

  return React.createElement(
    I18nContext.Provider,
    { value: contextValue },
    children
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}