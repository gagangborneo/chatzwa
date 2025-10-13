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
  },

  // Comparison Section
  'comparison.title': {
    id: 'Traditional vs AI',
    en: 'Traditional vs AI'
  },
  'comparison.subtitle': {
    id: 'Customer Service',
    en: 'Customer Service'
  },
  'comparison.description': {
    id: 'Lihat perbedaan dramatis dalam performance, cost, dan customer satisfaction',
    en: 'See the dramatic differences in performance, cost, and customer satisfaction'
  },
  'comparison.benefit1': {
    id: 'Reduction in operational costs',
    en: 'Reduction in operational costs'
  },
  'comparison.benefit2': {
    id: 'Increase in customer satisfaction',
    en: 'Increase in customer satisfaction'
  },
  'comparison.benefit3': {
    id: 'More inquiries handled',
    en: 'More inquiries handled'
  },
  'comparison.benefit4': {
    id: 'Support availability',
    en: 'Support availability'
  },
  'comparison.tableTitle': {
    id: 'Head-to-Head Comparison',
    en: 'Head-to-Head Comparison'
  },
  'comparison.aspect': {
    id: 'Aspect',
    en: 'Aspect'
  },
  'comparison.traditional': {
    id: 'Traditional',
    en: 'Traditional'
  },
  'comparison.aiPowered': {
    id: 'AI-Powered',
    en: 'AI-Powered'
  },
  'comparison.improvement': {
    id: 'Improvement',
    en: 'Improvement'
  },
  'comparison.responseTime': {
    id: 'Response Time',
    en: 'Response Time'
  },
  'comparison.operatingHours': {
    id: 'Operating Hours',
    en: 'Operating Hours'
  },
  'comparison.costPerInquiry': {
    id: 'Cost per Inquiry',
    en: 'Cost per Inquiry'
  },
  'comparison.customerSatisfaction': {
    id: 'Customer Satisfaction',
    en: 'Customer Satisfaction'
  },
  'comparison.scalability': {
    id: 'Scalability',
    en: 'Scalability'
  },
  'comparison.consistency': {
    id: 'Consistency',
    en: 'Consistency'
  },
  'comparison.traditionalCategory': {
    id: 'Traditional Customer Service',
    en: 'Traditional Customer Service'
  },
  'comparison.aiCategory': {
    id: 'AI-Powered Customer Service',
    en: 'AI-Powered Customer Service'
  },
  'comparison.manualProcess': {
    id: 'Manual Process',
    en: 'Manual Process'
  },
  'comparison.manualProcessDesc': {
    id: 'Semua interaksi harus ditangani oleh agen manusia',
    en: 'All interactions must be handled by human agents'
  },
  'comparison.limitedHours': {
    id: 'Limited Hours',
    en: 'Limited Hours'
  },
  'comparison.limitedHoursDesc': {
    id: 'Pelayanan hanya tersedia di jam kerja normal',
    en: 'Service only available during normal business hours'
  },
  'comparison.inconsistentQuality': {
    id: 'Inconsistent Quality',
    en: 'Inconsistent Quality'
  },
  'comparison.inconsistentQualityDesc': {
    id: 'Kualitas respons bergantung pada agen dan mood',
    en: 'Response quality depends on agent and mood'
  },
  'comparison.highCost': {
    id: 'High Operational Cost',
    en: 'High Operational Cost'
  },
  'comparison.highCostDesc': {
    id: 'Biaya gaji, training, dan infrastructure yang tinggi',
    en: 'High salary, training, and infrastructure costs'
  },
  'comparison.scalabilityIssues': {
    id: 'Scalability Issues',
    en: 'Scalability Issues'
  },
  'comparison.scalabilityIssuesDesc': {
    id: 'Sulit untuk scale saat volume tinggi',
    en: 'Difficult to scale during high volume'
  },
  'comparison.slowResponse': {
    id: 'Slow Response Time',
    en: 'Slow Response Time'
  },
  'comparison.slowResponseDesc': {
    id: 'Waktu respons yang lama untuk setiap inquiry',
    en: 'Long response time for each inquiry'
  },
  'comparison.instantAutomation': {
    id: 'Instant Automation',
    en: 'Instant Automation'
  },
  'comparison.instantAutomationDesc': {
    id: 'AI memberikan respons otomatis untuk inquiry yang umum',
    en: 'AI provides automatic responses for common inquiries'
  },
  'comparison.availability247': {
    id: '24/7 Availability',
    en: '24/7 Availability'
  },
  'comparison.availability247Desc': {
    id: 'Pelayanan non-stop tanpa tambahan biaya',
    en: 'Non-stop service without additional costs'
  },
  'comparison.consistentQuality': {
    id: 'Consistent Quality',
    en: 'Consistent Quality'
  },
  'comparison.consistentQualityDesc': {
    id: 'Kualitas respons yang terstandaris dan konsisten',
    en: 'Standardized and consistent response quality'
  },
  'comparison.costEffective': {
    id: 'Cost Effective',
    en: 'Cost Effective'
  },
  'comparison.costEffectiveDesc': {
    id: 'Biaya operasional yang jauh lebih rendah',
    en: 'Much lower operational costs'
  },
  'comparison.infiniteScalability': {
    id: 'Infinite Scalability',
    en: 'Infinite Scalability'
  },
  'comparison.infiniteScalabilityDesc': {
    id: 'Sistem yang bisa scale sesuai kebutuhan',
    en: 'System that can scale according to needs'
  },
  'comparison.smartEscalation': {
    id: 'Smart Escalation',
    en: 'Smart Escalation'
  },
  'comparison.smartEscalationDesc': {
    id: 'Auto-escalate ke manusia untuk kasus kompleks',
    en: 'Auto-escalate to humans for complex cases'
  },
  'comparison.testimonialsTitle': {
    id: 'Real Results from Real Customers',
    en: 'Real Results from Real Customers'
  },
  'comparison.testimonialsSubtitle': {
    id: 'Lihat bagaimana AI customer service transform bisnis nyata',
    en: 'See how AI customer service transforms real businesses'
  },
  'comparison.ctaTitle': {
    id: 'Siap transform customer service bisnis Anda dengan AI?',
    en: 'Ready to transform your business customer service with AI?'
  },
  'comparison.cta1': {
    id: 'Explore AI Solutions',
    en: 'Explore AI Solutions'
  },
  'comparison.cta2': {
    id: 'Customer Service Solution',
    en: 'Customer Service Solution'
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