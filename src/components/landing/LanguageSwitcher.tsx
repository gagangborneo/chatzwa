'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="fixed top-24 right-6 z-40">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
          <div className="flex gap-1">
            <Button
              onClick={() => setLanguage('id')}
              size="sm"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                language === 'id'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              ID
            </Button>
            <Button
              onClick={() => setLanguage('en')}
              size="sm"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              EN
            </Button>
          </div>
        </div>

        {/* Language Icon */}
        <div className="flex justify-center mt-2">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center">
            <Languages className="w-4 h-4 text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}