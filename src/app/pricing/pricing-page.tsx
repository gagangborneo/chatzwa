'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Check,
  X,
  Star,
  Users,
  Building,
  Zap,
  ArrowRight,
  BarChart3,
  Shield,
  Clock,
  Globe,
  Database,
  Smartphone,
  HeadphonesIcon,
  Code,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Starter',
      description: 'Cocok untuk bisnis kecil yang baru mulai dengan AI chatbot',
      icon: Zap,
      price: { monthly: 499000, annual: 4990000 },
      currency: 'IDR',
      color: 'from-blue-500 to-cyan-500',
      features: [
        { name: '1.000 pesan/bulan', included: true, detail: 'Ideal untuk testing dan implementasi awal' },
        { name: '2 pengguna', included: true, detail: 'Tim kecil Anda dapat mengakses dashboard' },
        { name: '1 chatbot aktif', included: true, detail: 'Satu chatbot untuk satu brand/kontak' },
        { name: 'WhatsApp Business API', included: true, detail: 'Koneksi resmi ke WhatsApp' },
        { name: 'Dashboard analytics dasar', included: true, detail: 'Monitoring performa dasar' },
        { name: 'Support email 24/7', included: true, detail: 'Bantuan teknis via email' },
        { name: 'Multi-bahasa (2 bahasa)', included: true, detail: 'Indonesia dan Inggris' },
        { name: 'Export data bulanan', included: true, detail: 'Download data percakapan' },
        { name: 'Custom branding', included: false, detail: 'Logo dan warna kustom' },
        { name: 'API access', included: false, detail: 'Integrasi dengan sistem lain' },
        { name: 'Advanced analytics', included: false, detail: 'Analitik mendalam' },
        { name: 'Priority support', included: false, detail: 'Support prioritas via chat' }
      ],
      popular: false,
      cta: 'Mulai Uji Coba Gratis',
      targetUsers: ['Startup', 'UKM', 'Bisnis Online'],
      limitations: ['Tidak ada API access', 'Tidak ada custom branding']
    },
    {
      name: 'Professional',
      description: 'Ideal untuk bisnis yang sedang berkembang dengan fitur lengkap',
      icon: Star,
      price: { monthly: 1499000, annual: 14990000 },
      currency: 'IDR',
      color: 'from-green-500 to-emerald-500',
      features: [
        { name: '10.000 pesan/bulan', included: true, detail: 'Volume tinggi untuk bisnis aktif' },
        { name: '10 pengguna', included: true, detail: 'Tim support yang lebih besar' },
        { name: '5 chatbot aktif', included: true, detail: 'Multiple brands/departemen' },
        { name: 'WhatsApp Business API', included: true, detail: 'Koneksi resmi dengan prioritas' },
        { name: 'Advanced analytics dashboard', included: true, detail: 'Insight mendalam tentang performa' },
        { name: 'Support 24/7 (Chat & Email)', included: true, detail: 'Respons cepat via live chat' },
        { name: 'Multi-bahasa (5+ bahasa)', included: true, detail: 'Indonesia, Inggris, Mandarin, Jepang, Korea' },
        { name: 'Real-time data export', included: true, detail: 'Export data kapan saja' },
        { name: 'Custom branding', included: true, detail: 'Logo, warna, dan personality kustom' },
        { name: 'Full API access', included: true, detail: 'Integrasi penuh dengan sistem Anda' },
        { name: 'CRM Integration', included: true, detail: 'HubSpot, Salesforce, dll' },
        { name: 'Monthly performance report', included: true, detail: 'Laporan performa bulanan' }
      ],
      popular: true,
      cta: 'Mulai Uji Coba Gratis',
      targetUsers: ['Bisnis Menengah', 'E-commerce', 'Service Company'],
      limitations: []
    },
    {
      name: 'Enterprise',
      description: 'Solusi khusus untuk kebutuhan enterprise dengan dukungan penuh',
      icon: Building,
      price: { monthly: 4999000, annual: 49990000 },
      currency: 'IDR',
      color: 'from-orange-500 to-red-500',
      features: [
        { name: 'Unlimited pesan', included: true, detail: 'Tanpa batasan volume pesan' },
        { name: 'Unlimited pengguna', included: true, detail: 'Semua tim Anda dapat akses' },
        { name: 'Unlimited chatbot', included: true, detail: 'Buat sebanyak yang Anda butuhkan' },
        { name: 'WhatsApp Business API Pro', included: true, detail: 'Prioritas tinggi dan rate limit tinggi' },
        { name: 'Custom analytics dashboard', included: true, detail: 'Dashboard yang dapat dikustomisasi' },
        { name: 'Dedicated account manager', included: true, detail: 'Manajer akun khusus untuk Anda' },
        { name: 'Multi-bahasa (50+ bahasa)', included: true, detail: 'Support bahasa global' },
        { name: 'Real-time data streaming', included: true, detail: 'Data real-time ke sistem Anda' },
        { name: 'Advanced custom branding', included: true, detail: 'Branding level enterprise' },
        { name: 'Enterprise API & SDK', included: true, detail: 'API khusus dengan SLA' },
        { name: 'Unlimited integrations', included: true, detail: 'Integrasi dengan semua sistem' },
        { name: 'AI training customization', included: true, detail: 'Model AI yang dikustomisasi' },
        { name: '99.99% uptime SLA', included: true, detail: 'Garansi uptime enterprise' },
        { name: 'On-premise deployment option', included: true, detail: 'Opsi deployment on-premise' },
        { name: 'Advanced security features', included: true, detail: 'SOC 2, HIPAA, GDPR compliant' }
      ],
      popular: false,
      cta: 'Hubungi Sales',
      targetUsers: ['Large Enterprise', 'Government', 'Multinational'],
      limitations: []
    }
  ]

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'IDR') {
      return formatRupiah(price)
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price)
  }

  const comparisonData = [
    {
      feature: 'Volume Pesan/Bulan',
      starter: '1.000',
      professional: '10.000',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Jumlah Pengguna',
      starter: '2',
      professional: '10',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Jumlah Chatbot',
      starter: '1',
      professional: '5',
      enterprise: 'Unlimited'
    },
    {
      feature: 'WhatsApp Business API',
      starter: 'Basic',
      professional: 'Standard',
      enterprise: 'Pro'
    },
    {
      feature: 'Analytics Dashboard',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Custom'
    },
    {
      feature: 'Support Channel',
      starter: 'Email',
      professional: 'Email & Chat',
      enterprise: 'All Channels'
    },
    {
      feature: 'API Access',
      starter: '✗',
      professional: '✓',
      enterprise: 'Full API'
    },
    {
      feature: 'Custom Branding',
      starter: '✗',
      professional: '✓',
      enterprise: 'Advanced'
    },
    {
      feature: 'SLA Uptime',
      starter: '99.5%',
      professional: '99.9%',
      enterprise: '99.99%'
    }
  ]

  const testimonials = [
    {
      name: 'PT Tech Maju Bersama',
      plan: 'Professional',
      quote: 'Dengan paket Professional, kami bisa menangani 10x lebih banyak customer inquiries secara otomatis. ROI yang luar biasa!',
      industry: 'Technology'
    },
    {
      name: 'TokoSejahtera',
      plan: 'Starter',
      quote: 'Paket Starter sangat sempurna untuk bisnis kami yang baru mulai. Supportnya sangat membantu dalam proses implementasi.',
      industry: 'E-commerce'
    },
    {
      name: 'Bank Digital Indonesia',
      plan: 'Enterprise',
      quote: 'Solusi Enterprise memberikan kami fleksibilitas dan security yang dibutuhkan untuk industri perbankan.',
      industry: 'Banking'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Harga yang transparan
              </span>
              <br />
              <span className="text-gray-700">untuk setiap kebutuhan bisnis</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Upgrade atau downgrade kapan saja tanpa penalti.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-lg ${!isAnnual ? 'text-gray-900' : 'text-gray-600'}`}>
                Bulanan
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-gradient-to-r from-green-600 to-emerald-600 transition-transform ${
                    isAnnual ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-lg ${isAnnual ? 'text-gray-900' : 'text-gray-600'}`}>
                Tahunan
                <Badge className="ml-2 bg-green-500 text-white">Hemat 17%</Badge>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'z-10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-sm font-semibold">
                      <Star className="w-4 h-4 mr-1" />
                      Paling Populer
                    </Badge>
                  </div>
                )}

                <Card className={`h-full bg-white border-2 ${
                  plan.popular ? 'border-green-500 shadow-2xl shadow-green-500/20' : 'border-gray-200 shadow-sm'
                } hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="text-center pb-6 pt-8">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 mb-6 text-sm px-4">{plan.description}</p>

                    {/* Target Users */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {plan.targetUsers.map((user, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {user}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(isAnnual ? plan.price.annual / 12 : plan.price.monthly, plan.currency)}
                      </span>
                      <span className="text-gray-500">/bulan</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-green-600 mt-2">
                        {formatPrice(plan.price.annual, plan.currency)} dibayar tahunan
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col px-8 pb-8">
                    <div className="flex-1 space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                              {feature.name}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{feature.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <strong>Batasan:</strong> {plan.limitations.join(', ')}
                        </p>
                      </div>
                    )}

                    <Link href={plan.name === 'Enterprise' ? '/contact' : '/dashboard'}>
                      <Button
                        className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 group ${
                          plan.popular
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25'
                            : 'border-green-600 text-green-600 bg-white hover:bg-green-50'
                        }`}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perbandingan Fitur Lengkap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat perbandingan detail fitur di setiap paket untuk membantu Anda memilih yang terbaik
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Fitur</th>
                  <th className="text-center py-4 px-6 font-semibold text-blue-600">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-green-600">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-orange-600">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="text-center py-4 px-6 text-gray-700">{row.starter}</td>
                    <td className="text-center py-4 px-6 text-gray-700">{row.professional}</td>
                    <td className="text-center py-4 px-6 text-gray-700">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dipercaya oleh Berbagai Bisnis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat bagaimana bisnis seperti Anda mendapatkan manfaat dari Chatzwa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className={`${testimonial.plan === 'Professional' ? 'border-green-500 text-green-600' : testimonial.plan === 'Enterprise' ? 'border-orange-500 text-orange-600' : 'border-blue-500 text-blue-600'}`}>
                      {testimonial.plan}
                    </Badge>
                    <Badge variant="secondary">{testimonial.industry}</Badge>
                  </div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang pricing dan fitur Chatzwa
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                q: "Apakah saya bisa mengubah paket kapan saja?",
                a: "Ya, Anda bisa upgrade atau downgrade paket kapan saja. Perubahan akan berlaku pada siklus penagihan berikutnya tanpa ada penalti."
              },
              {
                q: "Apa saja metode pembayaran yang tersedia?",
                a: "Kami menerima transfer bank, kartu kredit, dan e-wallet populer di Indonesia seperti GoPay, OVO, dan DANA."
              },
              {
                q: "Apakah ada garansi uang kembali?",
                a: "Ya, kami menawarkan garansi uang kembali 30 hari untuk paket Starter dan Professional. Jika Anda tidak puas, kami refund 100%."
              },
              {
                q: "Bagaimana cara menghitung penggunaan pesan?",
                a: "Pesan dihitung sebagai setiap percakapan masuk dan keluar. Pesan sistem seperti notifikasi tidak dihitung dalam kuota."
              },
              {
                q: "Apakah saya perlu kartu kredit untuk mendaftar?",
                a: "Tidak, Anda bisa mendaftar dengan metode pembayaran lain. Untuk Enterprise, kami menawarkan opsi pembayaran invoice."
              },
              {
                q: "Berapa lama proses setup?",
                a: "Setup dasar bisa dilakukan dalam 15 menit. Implementasi penuh dengan kustomisasi biasanya memakan waktu 1-3 hari kerja."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl max-w-4xl mx-auto">
              <CardContent className="p-12">
                <Building className="w-16 h-16 text-white mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">
                  Butuh Solusi Kustom?
                </h3>
                <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                  Kami menawarkan solusi enterprise yang dapat disesuaikan dengan kebutuhan spesifik bisnis Anda.
                  Hubungi tim sales kami untuk mendiskusikan kebutuhan Anda.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact">
                    <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-white text-green-600 hover:bg-gray-100 rounded-xl">
                      Hubungi Sales
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/solutions">
                    <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm">
                      Lihat Solusi
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}