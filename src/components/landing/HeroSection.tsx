'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import {
  MessageCircle,
  Smartphone,
  Zap,
  Shield,
  ArrowRight,
  Play,
  CheckCircle,
  Globe,
  Users,
  BarChart3,
  Bot,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AuroraBackground from './AuroraBackground'

const HeroSection = () => {
  const { t } = useLanguage()

  const features = [
    { icon: Bot, text: t('hero.feature1') },
    { icon: Smartphone, text: t('hero.feature2') },
    { icon: Globe, text: t('hero.feature3') },
    { icon: BarChart3, text: t('hero.feature4') }
  ]

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-green-50 to-emerald-50">
      {/* Aurora Background */}
      <AuroraBackground />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-green-700 bg-green-100 rounded-full border border-green-200">
            <MessageCircle className="w-4 h-4" />
            <span>{t('hero.badge')}</span>
            <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">AI</span>
          </div>

          {/* Logo and Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/25">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                  7connect
                </span>
              </h1>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('hero.subtitle')}
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 rounded-full border border-gray-200 backdrop-blur-sm shadow-sm"
              >
                <feature.icon className="w-4 h-4 text-green-600" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group"
              >
                {t('hero.cta1')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-green-300 text-green-700 bg-white hover:bg-green-50 rounded-2xl transition-all duration-300 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {t('hero.cta2')}
            </Button>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900 mb-2">
                <Users className="w-8 h-8 text-green-600" />
                <span>50K+</span>
              </div>
              <p className="text-gray-600">{t('hero.users')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900 mb-2">
                <Globe className="w-8 h-8 text-blue-600" />
                <span>25+</span>
              </div>
              <p className="text-gray-600">{t('hero.countries')}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900 mb-2">
                <Clock className="w-8 h-8 text-green-600" />
                <span>99.9%</span>
              </div>
              <p className="text-gray-600">{t('hero.uptime')}</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-8 text-sm">
            {t('footer.tagline')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            {['WhatsApp Business API', 'AI Powered', '24/7 Support', 'Enterprise Ready'].map((item, index) => (
              <div key={index} className="text-gray-700 font-semibold text-lg">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

export default HeroSection