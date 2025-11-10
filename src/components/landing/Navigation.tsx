'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  MessageCircle,
  Phone,
  ChevronDown,
  ArrowRight,
  Bot,
  BarChart3,
  Settings,
  Languages,
  Globe,
  Code
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const products = [
    { name: 'AI Chatbot', icon: Bot, href: '/products/ai-chatbot' },
    { name: 'WhatsApp Business', icon: MessageCircle, href: '/products/whatsapp' },
    { name: 'WordPress Plugin', icon: Globe, href: '/products/wordpress' },
    { name: 'Embed Chat', icon: Code, href: '/products/embed-chat' }
  ]

  const navigation = [
    { name: t('nav.products'), href: '#', hasDropdown: true },
    { name: 'Solusi', href: '/solutions', hasDropdown: false },
    { name: 'Blog', href: '/blog', hasDropdown: false },
    { name: t('nav.contact'), href: '/contact', hasDropdown: false },
    { name: t('nav.pricing'), href: '/pricing', hasDropdown: false, external: true }
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
            : 'bg-white border-b border-gray-200'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 transition-colors duration-300">chatzku</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <button
                      onMouseEnter={() => setIsProductsOpen(true)}
                      onMouseLeave={() => setIsProductsOpen(false)}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Products Dropdown */}
                  <AnimatePresence>
                    {item.hasDropdown && isProductsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setIsProductsOpen(true)}
                        onMouseLeave={() => setIsProductsOpen(false)}
                        className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl"
                      >
                        <div className="p-2">
                          {products.map((product) => (
                            <Link
                              key={product.name}
                              href={product.href}
                              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            >
                              <product.icon className="w-5 h-5 text-green-500" />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">View details</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right side items */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl">
                <Languages className="w-4 h-4 text-gray-600" />
                <div className="flex gap-1">
                  <button
                    onClick={() => setLanguage('id')}
                    className={`px-2 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
                      language === 'id'
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
                      language === 'en'
                        ? 'bg-green-500 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 rounded-xl">
                  {t('nav.signIn')}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300">
                  {t('nav.getStarted')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Right Side Items */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Language Switcher */}
              <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all duration-300 ${
                    language === 'id'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Mobile Sign In Button */}
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm">
                  {t('nav.signIn')}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 transition-colors duration-200"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t bg-white/95 border-gray-200 backdrop-blur-md"
            >
              <div className="container mx-auto px-6 py-6 space-y-4">
                {/* Navigation Items */}
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1 text-lg font-medium text-gray-700">
                          {item.name}
                          <ChevronDown className="w-4 h-4" />
                        </div>
                        {/* Mobile Dropdown Items */}
                        <div className="ml-4 space-y-2">
                          {products.map((product) => (
                            <Link
                              key={product.name}
                              href={product.href}
                              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                              onClick={() => setIsOpen(false)}
                            >
                              <product.icon className="w-5 h-5 text-green-500" />
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-gray-500">View details</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block text-lg text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl">
                      {t('nav.getStarted')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation