'use client'

import { useState } from 'react'
import {
  Cookie,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Monitor,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Database,
  Globe,
  Clock,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const CookiePolicyPage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: true,
    functional: true,
    advertising: false
  })

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const toggleCookie = (category: keyof typeof cookiePreferences) => {
    setCookiePreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  const sections = [
    {
      id: 'apa-itu-cookie',
      title: 'Apa itu Cookie?',
      icon: Cookie,
      content: [
        'Cookie adalah file teks kecil yang disimpan di browser atau perangkat Anda saat Anda mengunjungi website',
        'Cookie berisi informasi yang membantu website mengingat preferensi dan aktivitas Anda',
        'Cookie memungkinkan website untuk mengingat Anda di kunjungan berikutnya dan menyediakan pengalaman yang lebih baik',
        'Cookie tidak dapat mengeksekusi program atau menyebab virus di komputer Anda'
      ]
    },
    {
      id: 'jenis-cookie',
      title: 'Jenis Cookie yang Kami Gunakan',
      icon: Database,
      content: [
        'Essential Cookies: Diperlukan untuk operasi dasar website',
        'Analytics Cookies: Membantu kami memahami bagaimana pengguna berinteraksi dengan website',
        'Functional Cookies: Memungkinkan fitur personalisasi dan preferensi',
        'Advertising Cookies: Digunakan untuk menampilkan iklan yang relevan'
      ]
    },
    {
      id: 'cookie-7connect',
      title: 'Cookie Khusus 7connect',
      icon: Settings,
      content: [
        'Session ID: Untuk mengidentifikasi sesi login Anda',
        'Authentication Token: Untuk menjaga keamanan sesi',
        'User Preferences: Pengaturan bahasa, tema, dan personalisasi',
        'Analytics Data: Informasi penggunaan fitur dan performa',
        'CSRF Token: Untuk melindungi dari serangan CSRF',
        'Geolocation Data: Untuk menyediakan konten yang relevan secara regional'
      ]
    },
    {
      id: 'manajemen-cookie',
      title: 'Pengelolaan Cookie',
      icon: Eye,
      content: [
        'Anda dapat mengelola preferensi cookie melalui pengaturan browser',
        'Cookie pihak ketiga dapat dikelola melalui preferensi website',
        'Anda dapat menghapus cookie kapan saja melalui pengaturan browser',
        'Menghapus cookie dapat mempengaruhi pengalaman dan fungsi website',
        'Kami menyediakan cookie consent banner untuk memberikan pilihan transparan'
      ]
    },
    {
      id: 'keamanan-cookie',
      title: 'Keamanan Cookie',
      icon: Shield,
      content: [
        'Semua cookie 7connect dilindungi dengan enkripsi HTTPS',
        'Kami menggunakan HttpOnly flag untuk cookie sensitif',
        'Cookie session memiliki waktu kadaluarsa yang terbatas',
        'Kami tidak menggunakan cookie untuk mengumpulkan informasi pribadi sensitif',
        'Kami tidak berbagi cookie dengan pihak ketiga tanpa persetujuan'
      ]
    },
    {
      id: 'kebijakan-pihak-ketiga',
      title: 'Cookie Pihak Ketiga',
      icon: Globe,
      content: [
        'Google Analytics: Untuk analitik penggunaan website',
        'Facebook Pixel: Untuk tracking konversi iklan',
        'LinkedIn Insight Tag: Untuk analitik professional',
        'Hotjar: Untuk heatmap dan user session recording',
        'Intercom: Untuk layanan customer support',
        'Semua pihak ketiga telah melalui proses due diligence keamanan'
      ]
    }
  ]

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'Cookie yang sangat penting untuk operasi dasar website.',
      required: true,
      examples: [
        'Session cookies',
        'Authentication tokens',
        'CSRF protection',
        'Security settings'
      ],
      duration: 'Ses sampai browser ditutup',
      provider: '7connect'
    },
    {
      name: 'Analytics Cookies',
      description: 'Cookie yang membantu kami memahami penggunaan website.',
      required: false,
      examples: [
        'Google Analytics',
        'Session recording',
        'Heatmap data',
        'Performance metrics'
      ],
      duration: '2 tahun',
      provider: 'Google Analytics'
    },
    {
      name: 'Functional Cookies',
      description: 'Cookie yang memungkinkan fitur personalisasi.',
      required: false,
      examples: [
        'Language preferences',
        'Theme settings',
        'Dashboard customization',
        'Feature usage data'
      ],
      duration: '1 tahun',
      provider: '7connect'
    },
    {
      name: 'Advertising Cookies',
      description: 'Cookie yang digunakan untuk iklan dan marketing.',
      required: false,
      examples: [
        'Facebook Pixel',
        'LinkedIn Insight Tag',
        'Google Ads',
        'Retargeting data'
      ],
      duration: '30 hari',
      provider: 'Facebook, Google, LinkedIn'
    }
  ]

  const thirdPartyServices = [
    {
      name: 'Google Analytics',
      purpose: 'Analitik website dan performa',
      cookies: ['_ga', '_gid', '_gat'],
      link: 'https://policies.google.com/privacy'
    },
    {
      name: 'Facebook',
      purpose: 'Social media marketing dan analytics',
      cookies: ['_fbp', 'fr', 'tr'],
      link: 'https://www.facebook.com/policies/cookies'
    },
    {
      name: 'LinkedIn',
      purpose: 'Professional networking dan analytics',
      cookies: ['bscookie', 'lidc', 'bcookie'],
      link: 'https://www.linkedin.com/legal/cookie-policy'
    },
    {
      name: 'Hotjar',
      purpose: 'User experience research dan analytics',
      cookies: ['_hjIncludedInSample', '_hjDonePolls', '_hjMinPolls'],
      link: 'https://www.hotjar.com/legal/policies/privacy/'
    }
  ]

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    // Implement actual cookie consent logic here
    console.log('Cookie preferences saved:', cookiePreferences)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kebijakan Cookie
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kebijakan cookie 7connect menjelaskan bagaimana kami menggunakan cookie dan
              teknologi pelacakan lainnya untuk meningkatkan pengalaman pengguna website kami.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Cookie className="w-4 h-4" />
                <span>Versi 1.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RefreshCw className="w-4 h-4" />
                <span>Terakhir diperbarui: 13 Oktober 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Preferences Demo */}
      <section className="py-12 bg-amber-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-amber-500">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Preferensi Cookie Anda</h3>
                <p className="text-gray-700 mb-8">
                  Sesuaikan preferensi cookie Anda di bawah. Perubahan akan disimpan untuk kunjungan berikutnya.
                </p>
                <div className="space-y-6">
                  {Object.entries(cookiePreferences).map(([key, value]) => {
                    const cookie = cookieTypes.find(c => c.name.toLowerCase().includes(key.toLowerCase())) || cookieTypes[0]
                    return (
                      <div key={key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={value}
                              onCheckedChange={() => toggleCookie(key as keyof typeof cookiePreferences)}
                              disabled={key === 'essential'}
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900">{cookie.name}</h4>
                              <p className="text-sm text-gray-600">{cookie.description}</p>
                              {key === 'essential' && (
                                <Badge variant="outline" className="mt-1">Required</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {cookie.duration}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6">
                  <Button onClick={savePreferences} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                    Simpan Preferensi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Cookie Types Table */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Tipe Cookie yang Kami Gunakan</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Tipe Cookie</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Deskripsi</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Durasi</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTypes.map((cookie, index) => (
                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{cookie.name}</div>
                          {cookie.required && (
                            <Badge variant="outline" className="mt-1 text-xs">Required</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{cookie.description}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{cookie.duration}</td>
                      <td className="py-4 px-6 text-center text-gray-700">{cookie.provider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={section.id} className="border border-gray-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedSection === section.id && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Third Party Services */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Layanan Pihak Ketiga</h2>
            <p className="text-gray-700 mb-6">
              Kami menggunakan layanan pihak ketiga tepercaya untuk analitik, marketing, dan customer support.
              Berikut adalah daftar layanan yang kami gunakan:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {thirdPartyServices.map((service, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{service.purpose}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Cookie:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {service.cookies.map((cookie, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {cookie}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Link:</span>
                        <div className="mt-1">
                          <a
                            href={service.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            {service.link}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cookie Management Guide */}
          <Card className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Panduan Manajemen Cookie</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Melalui Browser Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Monitor className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Desktop Browser</p>
                        <p className="text-xs text-gray-600">Settings → Privacy → Cookies → Manage cookies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mobile Browser</p>
                        <p className="text-xs text-gray-600">Settings → Privacy → Clear browsing data</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Opsi Manajemen</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Eye className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Accept/Reject</p>
                        <p className="text-xs text-gray-600">Pilih cookie yang ingin Anda terima</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <EyeOff className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Clear Cookies</p>
                        <p className="text-xs text-gray-600">Hapus semua cookie yang tersimpan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="mt-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum tentang Cookie</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Apakah cookie berbahaya?</h4>
                  <p className="text-gray-700">
                    Tidak, cookie adalah file teks biasa yang tidak dapat menjalankan program. Mereka tidak menyebab virus
                    atau malware. Namun, cookie dapat digunakan oleh malware untuk melacak aktivitas pengguna.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bagaimana cara menonaktifkan cookie?</h4>
                  <p className="text-gray-700">
                    Anda dapat menonaktifkan cookie melalui pengaturan browser di bagian Privacy atau Security. Setiap browser
                    memiliki cara yang berbeda untuk mengelola cookie.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Apa yang terjadi jika saya menolak cookie?</h4>
                  <p className="text-gray-700">
                    Menolak cookie dapat memengaruhi pengalaman website. Beberapa fitur mungkin tidak berfungsi dengan baik,
                    dan Anda mungkin perlu login kembali saat mengunjungi situs.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Berapa lama cookie bertahan?</h4>
                  <p className="text-gray-700">
                    Durasi cookie bervari tergantung jenisnya. Session cookies biasanya kedaluarsa saat browser ditutup,
                    sementara persistent cookies dapat bertahan dari beberapa hari hingga beberapa tahun.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan tentang Cookie?</h3>
              <p className="text-gray-700 mb-6">
                Jika Anda memiliki pertanyaan tentang kebijakan cookie kami atau preferensi privasi Anda,
                jangan ragu untuk menghubungi kami.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Cookie className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Cookie</p>
                    <p className="text-sm text-gray-700">privacy@7connect.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">DPO</p>
                    <p className="text-sm text-gray-700">dpo@7connect.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Help Center</p>
                    <p className="text-sm text-gray-700">help@7connect.id</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-16 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Kebijakan Cookie ini berlaku efektif sejak 13 Oktober 2024.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Terakhir diperbarui: 13 Oktober 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Cookie className="w-4 h-4" />
                <span>Versi 1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CookiePolicyPage