'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'id' | 'en'

interface Translations {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  // Navigation
  'nav.products': {
    id: 'Produk',
    en: 'Products'
  },
  'nav.pricing': {
    id: 'Harga',
    en: 'Pricing'
  },
  'nav.about': {
    id: 'Tentang',
    en: 'About'
  },
  'nav.contact': {
    id: 'Kontak',
    en: 'Contact'
  },
  'nav.signIn': {
    id: 'Masuk',
    en: 'Sign In'
  },
  'nav.getStarted': {
    id: 'Mulai',
    en: 'Get Started'
  },

  // Hero Section
  'hero.badge': {
    id: 'Solusi WhatsApp AI Terdepan',
    en: 'Leading WhatsApp AI Solution'
  },
  'hero.title': {
    id: 'Layanan Pelanggan Otomatis',
    en: 'Automated Customer Service'
  },
  'hero.subtitle': {
    id: 'dengan Kecerdasan Buatan',
    en: 'with Artificial Intelligence'
  },
  'hero.description': {
    id: 'Transformasi layanan pelanggan Anda dengan chatbot AI canggih kami. Integrasi WhatsApp yang seamless untuk pengalaman pelanggan yang luar biasa.',
    en: 'Transform your customer service with our advanced AI chatbot. Seamless WhatsApp integration for exceptional customer experiences.'
  },
  'hero.cta1': {
    id: 'Coba Gratis',
    en: 'Try for Free'
  },
  'hero.cta2': {
    id: 'Lihat Demo',
    en: 'Watch Demo'
  },
  'hero.feature1': {
    id: 'Chatbot AI 24/7',
    en: '24/7 AI Chatbot'
  },
  'hero.feature2': {
    id: 'Integrasi WhatsApp',
    en: 'WhatsApp Integration'
  },
  'hero.feature3': {
    id: 'Multi Bahasa',
    en: 'Multi-Language'
  },
  'hero.feature4': {
    id: 'Analytics Real-time',
    en: 'Real-time Analytics'
  },
  'hero.users': {
    id: 'Pengguna Aktif',
    en: 'Active Users'
  },
  'hero.countries': {
    id: 'Negara',
    en: 'Countries'
  },
  'hero.uptime': {
    id: 'Uptime',
    en: 'Uptime'
  },

  // Features Section
  'features.title': {
    id: 'Fitur Unggulan',
    en: 'Premium Features'
  },
  'features.subtitle': {
    id: 'Solusi lengkap untuk kebutuhan layanan pelanggan bisnis Anda',
    en: 'Complete solutions for your business customer service needs'
  },
  'features.tab1': {
    id: 'Chatbot AI',
    en: 'AI Chatbot'
  },
  'features.tab2': {
    id: 'WhatsApp Business',
    en: 'WhatsApp Business'
  },
  'features.tab3': {
    id: 'Analytics',
    en: 'Analytics'
  },
  'features.ai.title': {
    id: 'Kecerdasan Buatan',
    en: 'Artificial Intelligence'
  },
  'features.ai.desc': {
    id: 'Chatbot AI dengan NLP canggih untuk memahami dan merespons pelanggan secara natural.',
    en: 'AI chatbot with advanced NLP to understand and respond to customers naturally.'
  },
  'features.whatsapp.title': {
    id: 'Integrasi WhatsApp',
    en: 'WhatsApp Integration'
  },
  'features.whatsapp.desc': {
    id: 'Integrasi sempurna dengan WhatsApp Business API untuk komunikasi yang andal.',
    en: 'Perfect integration with WhatsApp Business API for reliable communication.'
  },
  'features.analytics.title': {
    id: 'Analitik Cerdas',
    en: 'Smart Analytics'
  },
  'features.analytics.desc': {
    id: 'Dashboard real-time untuk monitoring performa dan insight pelanggan.',
    en: 'Real-time dashboard for performance monitoring and customer insights.'
  },

  // Testimonials Section
  'testimonials.title': {
    id: 'Dipercaya Oleh',
    en: 'Trusted By'
  },
  'testimonials.subtitle': {
    id: 'Ratusan Bisnis di Indonesia',
    en: 'Hundreds of Businesses in Indonesia'
  },

  // Pricing Section
  'pricing.title': {
    id: 'Harga Terjangkau',
    en: 'Affordable Pricing'
  },
  'pricing.subtitle': {
    id: 'Pilih paket yang sesuai dengan kebutuhan bisnis Anda',
    en: 'Choose the plan that suits your business needs'
  },
  'pricing.monthly': {
    id: 'Bulanan',
    en: 'Monthly'
  },
  'pricing.annual': {
    id: 'Tahunan',
    en: 'Annual'
  },
  'pricing.save': {
    id: 'Hemat 20%',
    en: 'Save 20%'
  },
  'pricing.basic.name': {
    id: 'Starter',
    en: 'Starter'
  },
  'pricing.basic.desc': {
    id: 'Cocok untuk bisnis kecil yang baru mulai',
    en: 'Perfect for small businesses just starting'
  },
  'pricing.pro.name': {
    id: 'Professional',
    en: 'Professional'
  },
  'pricing.pro.desc': {
    id: 'Ideal untuk bisnis yang sedang berkembang',
    en: 'Ideal for growing businesses'
  },
  'pricing.enterprise.name': {
    id: 'Enterprise',
    en: 'Enterprise'
  },
  'pricing.enterprise.desc': {
    id: 'Solusi khusus untuk kebutuhan enterprise',
    en: 'Custom solutions for enterprise needs'
  },

  // Contact Section
  'contact.title': {
    id: 'Hubungi Kami',
    en: 'Contact Us'
  },
  'contact.subtitle': {
    id: 'Tim kami siap membantu Anda memulai',
    en: 'Our team is ready to help you get started'
  },
  'contact.name': {
    id: 'Nama',
    en: 'Name'
  },
  'contact.email': {
    id: 'Email',
    en: 'Email'
  },
  'contact.company': {
    id: 'Perusahaan',
    en: 'Company'
  },
  'contact.message': {
    id: 'Pesan',
    en: 'Message'
  },
  'contact.send': {
    id: 'Kirim Pesan',
    en: 'Send Message'
  },

  // Footer
  'footer.tagline': {
    id: 'Solusi WhatsApp AI untuk layanan pelanggan otomatis',
    en: 'WhatsApp AI solution for automated customer service'
  },
  'footer.newsletter': {
    id: 'Dapatkan Update Terbaru',
    en: 'Get Latest Updates'
  },
  'footer.newsEmail': {
    id: 'Masukkan email Anda',
    en: 'Enter your email'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id')

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}