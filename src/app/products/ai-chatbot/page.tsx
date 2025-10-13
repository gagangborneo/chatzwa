'use client'

import { useState } from 'react'
import {
  Bot,
  MessageCircle,
  Zap,
  Shield,
  Globe,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Cpu,
  Database,
  Wifi,
  Smartphone,
  Code,
  BarChart3,
  Play,
  ChevronDown,
  ChevronUp,
  HeadphonesIcon,
  ZapIcon,
  Target,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const AIChatbotPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const features = [
    {
      icon: MessageCircle,
      title: 'Percakapan Natural',
      description: 'AI chatbot dengan kemampuan bahasa natural yang memahami konteks dan intent pelanggan'
    },
    {
      icon: Zap,
      title: 'Respon Cepat 24/7',
      description: 'Respon instan kapan saja, memberikan pelayanan tanpa henti untuk pelanggan Anda'
    },
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description: 'Enkripsi end-to-end dan compliance dengan standar keamanan data internasional'
    },
    {
      icon: Database,
      title: 'Pengetahuan Terpersonalisasi',
      description: 'Pelajari dan adaptasi dengan bisnis Anda untuk memberikan jawaban yang relevan'
    },
    {
      icon: Globe,
      title: 'Multi-Bahasa',
      description: 'Dukungan bahasa Indonesia dan Inggris dengan kemampuan bahasa natural yang baik'
    },
    {
      icon: BarChart3,
      title: 'Analytics Canggih',
      description: 'Dashboard analytics untuk memantau performa dan mendapatkan insight berharga'
    }
  ]

  const integrations = [
    {
      name: 'WhatsApp Business',
      icon: MessageCircle,
      description: 'Integrasi sempurna dengan WhatsApp Business API untuk reach maksimal',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Auto-reply messages',
        'Interactive buttons',
        'Media sharing',
        'Customer segmentation'
      ]
    },
    {
      name: 'WordPress Plugin',
      icon: Globe,
      description: 'Plugin WordPress yang mudah diinstall dan konfigurasi',
      color: 'from-blue-500 to-indigo-500',
      features: [
        'One-click installation',
        'Customizable widget',
        'Mobile responsive',
        'SEO friendly'
      ]
    },
    {
      name: 'Embed Chat Widget',
      icon: Code,
      description: 'Embeddable chat widget untuk website dan aplikasi Anda',
      color: 'from-purple-500 to-pink-500',
      features: [
        'Customizable design',
        'Multi-platform support',
        'Real-time notifications',
        'Developer API'
      ]
    }
  ]

  const benefits = [
    {
      metric: '80%',
      label: 'Pengurangan biaya operasional customer service',
      icon: TrendingUp
    },
    {
      metric: '24/7',
      label: 'Pelayanan tanpa henti tanpa tambahan staff',
      icon: Clock
    },
    {
      metric: '3x',
      label: 'Peningkatan kepuasan pelanggan',
      icon: Users
    },
    {
      metric: '90%',
      label: 'Resolusi masalah tanpa perlu eskalasi',
      icon: Target
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      role: 'Customer Service Manager',
      company: 'E-Commerce Store',
      content: 'AI chatbot 7connect mengubah cara kami melayani pelanggan. Respon waktu turun drastis dan kepuasan pelanggan meningkat signifikan!',
      rating: 5
    },
    {
      name: 'Budi Santoso',
      role: 'Operations Director',
      company: 'Tech Startup',
      content: 'Integrasi dengan WhatsApp sangat mudah. Sekarang pelanggan bisa mendapatkan bantuan instan langsung di platform favorit mereka.',
      rating: 5
    },
    {
      name: 'Maya Putri',
      role: 'Founder',
      company: 'Digital Agency',
      content: 'Plugin WordPress-nya sangat user-friendly. Kami bisa implementasi chatbot AI dalam hitungan menit tanpa technical knowledge.',
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Rp 299K',
      period: '/bulan',
      description: 'Perfect untuk small business',
      features: [
        '500 conversations/bulan',
        'WhatsApp integration',
        'Basic analytics',
        'Email support',
        'Custom branding'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: 'Rp 799K',
      period: '/bulan',
      description: 'Ideal untuk growing business',
      features: [
        '2,000 conversations/bulan',
        'All integrations (WhatsApp, WordPress, Embed)',
        'Advanced analytics',
        'Priority support',
        'Custom AI training',
        'Multi-language support'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Solution untuk large scale business',
      features: [
        'Unlimited conversations',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'On-premise deployment option',
        'Advanced security features'
      ],
      highlighted: false
    }
  ]

  const faqs = [
    {
      question: 'Bagaimana cara kerja AI chatbot 7connect?',
      answer: 'AI chatbot kami menggunakan teknologi NLP canggih untuk memahami pertanyaan pelanggan dalam bahasa natural. Sistem belajar dari data bisnis Anda dan memberikan jawaban yang relevan dan akurat.'
    },
    {
      question: 'Berapa lama waktu yang dibutuhkan untuk setup?',
      answer: 'Setup dasar bisa dilakukan dalam 15 menit. Untuk integrasi penuh dengan WhatsApp dan WordPress, biasanya membutuhkan waktu kurang dari 1 jam.'
    },
    {
      question: 'Apakah bisa di-train dengan data perusahaan saya?',
      answer: 'Ya, kami bisa melatih AI dengan data spesifik perusahaan Anda, termasuk produk, layanan, FAQ, dan kebijakan perusahaan untuk memberikan jawaban yang lebih personal.'
    },
    {
      question: 'Bagaimana dengan keamanan data pelanggan?',
      answer: 'Semua data dienkripsi end-to-end dan kami compliance dengan GDPR, CCPA, dan peraturan privasi lainnya. Data pelanggan Anda aman bersama kami.'
    },
    {
      question: 'Apakah ada trial gratis?',
      answer: 'Ya, kami menawarkan free trial 14 hari dengan fitur penuh. Anda bisa test semua integrasi dan fitur sebelum memutuskan berlangganan.'
    }
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Chatbot Cerdas untuk Bisnis Anda
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Sistem pelayanan otomatis yang terhubung langsung ke bisnis Anda.
              Berikan pengalaman customer service 24/7 dengan AI yang memahami kebutuhan pelanggan Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Play className="w-5 h-5 mr-2" />
                Demo Gratis
              </Button>
              <Button variant="outline" size="lg">
                <HeadphonesIcon className="w-5 h-5 mr-2" />
                Konsultasi Gratis
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{benefit.metric}</div>
                <div className="text-sm text-gray-600">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan AI Chatbot
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Teknologi AI terdepan yang dirancang khusus untuk kebutuhan customer service bisnis Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Integrasi Sempurna dengan Platform Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cukup koneksikan ke sistem kami, AI akan siap melayani pelanggan Anda di berbagai platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center mb-4`}>
                    <integration.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{integration.name}</h3>
                  <p className="text-gray-600 mb-4">{integration.description}</p>
                  <ul className="space-y-2 mb-6">
                    {integration.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Kerja Sederhana
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dalam 3 langkah mudah, AI chatbot kami siap melayani pelanggan Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Koneksi ke Sistem</h3>
              <p className="text-gray-600">
                Connect AI chatbot ke WhatsApp, WordPress, atau website Anda dengan API key yang mudah
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Training AI</h3>
              <p className="text-gray-600">
                AI belajar dari data bisnis Anda untuk memberikan jawaban yang relevan dan personal
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Siap Melayani</h3>
              <p className="text-gray-600">
                AI chatbot siap melayani pelanggan 24/7 dengan respon cepat dan akurat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dipercaya oleh Bisnis Indonesia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat bagaimana AI chatbot kami mengubah customer service untuk bisnis-bisnis terkemuka
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Harga yang Sesuai untuk Bisnis Anda
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Paket fleksibel yang bisa disesuaikan dengan kebutuhan dan skala bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`${plan.highlighted ? 'border-2 border-green-500 shadow-lg' : 'border border-gray-200'}`}>
                <CardContent className="p-6">
                  {plan.highlighted && (
                    <div className="text-center mb-4">
                      <Badge className="bg-green-500 text-white">POPULER</Badge>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
                    <div className="text-gray-600">{plan.period}</div>
                    <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                  </div>
                  <Button
                    className={`w-full mb-6 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.name === 'Enterprise' ? 'Hubungi Sales' : 'Mulai Gratis'}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang AI chatbot kami
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="mb-4 border border-gray-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Meningkatkan Customer Service Anda?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan bisnis yang sudah merasakan manfaat AI chatbot 7connect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Rocket className="w-5 h-5 mr-2" />
              Mulai Free Trial 14 Hari
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <HeadphonesIcon className="w-5 h-5 mr-2" />
              Jadwalkan Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AIChatbotPage