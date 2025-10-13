'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Settings, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    functional: true,
    advertising: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem('cookieConsent')
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      functional: true,
      advertising: true
    }
    setPreferences(allAccepted)
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
    // Implement actual cookie setting logic here
    console.log('All cookies accepted:', allAccepted)
  }

  const acceptSelected = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    localStorage.setItem('cookieConsent', 'custom')
    setIsVisible(false)
    // Implement actual cookie setting logic here
    console.log('Selected cookies accepted:', preferences)
  }

  const rejectAll = () => {
    const onlyEssential = {
      essential: true,
      analytics: false,
      functional: false,
      advertising: false
    }
    setPreferences(onlyEssential)
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyEssential))
    localStorage.setItem('cookieConsent', 'rejected')
    setIsVisible(false)
    // Implement actual cookie setting logic here
    console.log('Only essential cookies accepted:', onlyEssential)
  }

  const togglePreference = (category: keyof typeof preferences) => {
    if (category === 'essential') return // Essential cookies cannot be disabled
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
  }

  if (!isVisible && !showSettings) return null

  return (
    <>
      {/* Main Cookie Banner */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Icon and Message */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kami Menggunakan Cookie
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Kami dan mitra kami menggunakan cookie untuk meningkatkan pengalaman Anda di website kami,
                    menampilkan iklan yang relevan, dan menganalisis traffic. Dengan melanjutkan penggunaan website,
                    Anda menyetujui penggunaan cookie sesuai Kebijakan Cookie kami.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={openSettings}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </Button>
                <Button
                  variant="outline"
                  onClick={rejectAll}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Tolak Semua
                </Button>
                <Button
                  onClick={acceptAll}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Terima Semua
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Pengaturan Cookie</h3>
                    <p className="text-sm text-gray-600">Kelola preferensi cookie Anda</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSettings}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Cookie Categories */}
              <div className="space-y-6 mb-8">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Cookie Esensial</h4>
                      <p className="text-sm text-gray-600">
                        Diperlukan untuk operasi dasar website. Tidak dapat dinonaktifkan.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 font-medium">Selalu Aktif</span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Cookie className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Cookie Analitik</h4>
                      <p className="text-sm text-gray-600">
                        Membantu kami memahami bagaimana pengguna berinteraksi dengan website.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Cookie Fungsional</h4>
                      <p className="text-sm text-gray-600">
                        Memungkinkan fitur personalisasi dan preferensi pengguna.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => togglePreference('functional')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Cookie className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Cookie Iklan</h4>
                      <p className="text-sm text-gray-600">
                        Digunakan untuk menampilkan iklan yang relevan dengan minat Anda.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.advertising}
                      onChange={() => togglePreference('advertising')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <h4 className="font-semibold text-blue-900 mb-2">Informasi Tambahan</h4>
                <p className="text-sm text-blue-700">
                  Untuk informasi lebih detail tentang cookie yang kami gunakan, Anda dapat membaca
                  <a href="/cookies" className="underline hover:text-blue-800 font-medium"> Kebijakan Cookie</a>
                  {" "}kami.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={rejectAll}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Tolak Semua
                </Button>
                <Button
                  onClick={acceptSelected}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Simpan Preferensi
                </Button>
                <Button
                  onClick={acceptAll}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Terima Semua
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CookieConsent