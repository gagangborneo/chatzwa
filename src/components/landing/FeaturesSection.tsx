'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  MessageSquare,
  Bot,
  Smartphone,
  BarChart,
  Globe,
  Clock,
  Shield,
  Zap,
  Database,
  Cloud,
  Lock,
  Settings,
  TrendingUp,
  Users,
  HeadphonesIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('ai')
  const { t } = useLanguage()

  const features = {
    ai: [
      {
        icon: Bot,
        title: 'AI Chatbot Cerdas',
        description: 'Chatbot AI dengan Natural Language Processing untuk memahami dan merespons pelanggan secara natural.',
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        icon: Globe,
        title: 'Multi-Bahasa',
        description: 'Mendukung berbagai bahasa termasuk Bahasa Indonesia, Inggris, dan bahasa lokal lainnya.',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: Clock,
        title: '24/7 Available',
        description: 'Layanan non-stop untuk membantu pelanggan kapan saja, tanpa batasan waktu.',
        gradient: 'from-purple-500 to-pink-500'
      }
    ],
    whatsapp: [
      {
        icon: MessageSquare,
        title: 'WhatsApp Business API',
        description: 'Integrasi resmi dengan WhatsApp Business API untuk komunikasi yang aman dan terpercaya.',
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        icon: Users,
        title: 'Multi-Agent Support',
        description: 'Support multi-agent untuk handover ke tim customer service ketika diperlukan.',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: Shield,
        title: 'End-to-End Encryption',
        description: 'Keamanan terjamin dengan enkripsi end-to-end untuk semua percakapan.',
        gradient: 'from-purple-500 to-pink-500'
      }
    ],
    analytics: [
      {
        icon: BarChart,
        title: 'Real-time Dashboard',
        description: 'Dashboard analitik real-time untuk monitoring performa dan insight pelanggan.',
        gradient: 'from-orange-500 to-red-500'
      },
      {
        icon: TrendingUp,
        title: 'Conversation Analytics',
        description: 'Analisis mendalam tentang pola percakapan dan kepuasan pelanggan.',
        gradient: 'from-indigo-500 to-purple-500'
      },
      {
        icon: Database,
        title: 'Data Export',
        description: 'Export data percakapan untuk analisis lebih lanjut dan compliance.',
        gradient: 'from-teal-500 to-blue-500'
      }
    ]
  }

  const allFeatures = [
    {
      icon: Settings,
      title: 'Custom Workflow',
      description: 'Workflow yang dapat dikustomisasi sesuai dengan kebutuhan bisnis Anda.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Response time super cepat dengan latency kurang dari 100ms.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Infrastruktur cloud yang scalable dengan 99.9% uptime SLA.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Keamanan enterprise dengan SOC 2 compliance.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Dukungan teknis 24/7 dari tim ahli kami.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Database,
      title: 'API Integration',
      description: 'RESTful API yang mudah untuk integrasi dengan sistem existing.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50" id="features">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('features.title')}
            </span>
            <br />
            <span className="text-gray-700">untuk Bisnis Anda</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-white rounded-xl border border-gray-200 shadow-sm">
            {[
              { key: 'ai', label: t('features.tab1') },
              { key: 'whatsapp', label: t('features.tab2') },
              { key: 'analytics', label: t('features.tab3') }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <div key={index}>
              <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* All Features Grid */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Fitur Lengkap untuk Kebutuhan Anda
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((feature, index) => (
              <div
                key={index}
                className="group"
              >
                <Card className="h-full bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Siap Transformasi Layanan Pelanggan Anda?
              </h3>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ratusan bisnis yang sudah menggunakan chatzku untuk layanan pelanggan yang luar biasa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-white text-green-600 hover:bg-gray-100 rounded-xl">
                  Mulai Gratis
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm">
                  Jadwalkan Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection