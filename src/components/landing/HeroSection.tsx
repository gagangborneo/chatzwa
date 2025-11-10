'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
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
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-green-700 bg-green-100 rounded-full border border-green-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('hero.badge')}</span>
            <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">AI</span>
          </motion.div>

          {/* Logo and Brand */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/25"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-bold"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                  chatzku
                </span>
              </motion.h1>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
              {t('hero.title')}
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t('hero.subtitle')}
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {t('hero.description')}
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 rounded-full border border-gray-200 backdrop-blur-sm shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <feature.icon className="w-4 h-4 text-green-600" />
                <span>{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group"
                >
                  {t('hero.cta1')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-green-300 text-green-700 bg-white hover:bg-green-50 rounded-2xl transition-all duration-300 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                {t('hero.cta2')}
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          >
            {[
              { icon: Users, value: "50K+", label: t('hero.users'), color: "text-green-600" },
              { icon: Globe, value: "25+", label: t('hero.countries'), color: "text-blue-600" },
              { icon: Clock, value: "99.9%", label: t('hero.uptime'), color: "text-green-600" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-gray-900 mb-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span>{stat.value}</span>
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

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