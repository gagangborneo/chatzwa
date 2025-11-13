'use client'

import { useState } from 'react'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Clock,
  MessageCircle,
  Zap,
  Shield,
  Headphones,
  BarChart3,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const EcommerceSolution = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Tingkatkan Konversi',
      description: 'AI membantu pelanggan menemukan produk yang tepat dan menjawab pertanyaan tentang spesifikasi'
    },
    {
      icon: Clock,
      title: 'Support 24/7',
      description: 'Pelanggan dapat bertanya kapan saja, bahkan di luar jam kerja, tanpa menunggu respons manusia'
    },
    {
      icon: Users,
      title: 'Personalisasi Pengalaman',
      description: 'AI mengingat preferensi pelanggan dan memberikan rekomendasi produk yang relevan'
    },
    {
      icon: Shield,
      title: 'Reduced Return Rate',
      description: 'AI memberikan informasi produk yang akurat untuk mengurangi pengembalian yang tidak perlu'
    }
  ]

  const useCases = [
    {
      category: 'Product Discovery',
      icon: Package,
      scenarios: [
        'Membantu pelanggan menemukan produk berdasarkan kebutuhan',
        'Memberikan rekomendasi produk yang sesuai',
        'Membandingkan fitur dan harga produk'
      ]
    },
    {
      category: 'Order Support',
      icon: ShoppingCart,
      scenarios: [
        'Status pengiriman real-time',
        'Informasi stok produk',
        'Bantuan proses checkout dan pembayaran'
      ]
    },
    {
      category: 'Customer Service',
      icon: Headphones,
      scenarios: [
        'FAQ otomatis tentang kebijakan toko',
        'Bantuan retur dan refund',
        'Informasi garansi dan after-sales'
      ]
    }
  ]

  const stats = [
    {
      metric: '67%',
      label: 'Pelanggan lebih memilih chat untuk product inquiry',
      icon: MessageCircle
    },
    {
      metric: '24/7',
      label: 'Availability untuk customer support',
      icon: Clock
    },
    {
      metric: '40%',
      label: 'Peningkatan conversion rate dengan AI assistance',
      icon: TrendingUp
    },
    {
      metric: '60%',
      label: 'Pengurangan response time untuk customer queries',
      icon: Zap
    }
  ]

  const features = [
    {
      title: 'Product Recommendations',
      description: 'AI menganalisis perilaku pelanggan untuk memberikan rekomendasi produk yang personal dan relevan',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Order Tracking',
      description: 'Integrasi real-time dengan sistem logistik untuk memberikan update pengiriman yang akurat',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Inventory Management',
      description: 'AI memberikan informasi stok real-time dan mensuggest alternatif produk saat stok habis',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Payment Support',
      description: 'Bantuan lengkap untuk proses pembayaran, termasuk berbagai metode pembayaran dan promo codes',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Solusi E-commerce
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered E-commerce
              <br />
              Customer Experience
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Transformasi shopping experience dengan AI chatbot yang membantu pelanggan menemukan produk,
              melacak pesanan, dan mendapatkan support 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl">
                  Demo Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products/ai-chatbot">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl">
                  Lihat Fitur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.metric}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mengapa E-commerce Perlu AI Chatbot?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pelanggan modern mengharapkan respons instan dan personalisasi. AI chatbot memberikan
                pengalaman berbelanja yang superior sambil mengurangi beban tim customer service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Fitur Lengkap untuk E-commerce
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Solusi AI yang dirancang khusus untuk kebutuhan dan tantangan bisnis e-commerce
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-6">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Use Cases untuk E-commerce
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Berbagai skenario implementasi AI chatbot untuk meningkatkan customer experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <useCase.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{useCase.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {useCase.scenarios.map((scenario, scenarioIndex) => (
                        <li key={scenarioIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 text-sm">{scenario}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Transform E-commerce Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan bisnis e-commerce yang telah meningkatkan customer experience
              dan penjualan dengan AI chatbot dari Chatzwa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl">
                  Mulai Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products/whatsapp">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl">
                  Integrasi WhatsApp
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default EcommerceSolution