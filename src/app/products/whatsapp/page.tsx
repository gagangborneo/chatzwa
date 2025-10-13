'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Smartphone,
  Zap,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Code,
  BarChart3,
  Play,
  ChevronDown,
  ChevronUp,
  Bot,
  MessageSquare,
  Send,
  Phone,
  Image,
  FileText,
  Settings,
  Lock,
  TrendingUp,
  HeadphonesIcon,
  Rocket,
  Target,
  Database,
  Cloud,
  Key
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const WhatsAppPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const features = [
    {
      icon: MessageSquare,
      title: 'Auto-Reply Intelligent',
      description: 'AI-powered auto responses yang memahami konteks dan intent pelanggan secara natural'
    },
    {
      icon: Send,
      title: 'Interactive Messages',
      description: 'Button templates, list messages, dan quick replies untuk percakapan yang interaktif'
    },
    {
      icon: Users,
      title: 'Customer Segmentation',
      description: 'Segmentasi pelanggan otomatis berdasarkan behavior dan preferences'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Dashboard real-time untuk monitor performa dan customer insights'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'End-to-end encryption dengan compliance standar internasional'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Support bahasa Indonesia, Inggris, dan bahasa lainnya'
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Registrasi WhatsApp Business API',
      description: 'Daftarkan nomor WhatsApp Anda melalui verified Business Service Provider',
      icon: MessageCircle,
      details: [
        'Verifikasi nomor bisnis',
        'Setup Business Profile',
        'Aktifkan WhatsApp Business API',
        'Dapatkan API credentials'
      ]
    },
    {
      step: 2,
      title: 'Connect ke 7connect Platform',
      description: 'Hubungkan WhatsApp API credentials ke dashboard 7connect Anda',
      icon: Key,
      details: [
        'Login ke dashboard 7connect',
        'Masukkan API key dan secret',
        'Configure webhook URL',
        'Test connection'
      ]
    },
    {
      step: 3,
      title: 'Setup AI Chatbot',
      description: 'Konfigurasi AI chatbot dengan knowledge base bisnis Anda',
      icon: Bot,
      details: [
        'Upload produk dan layanan info',
        'Set conversation flows',
        'Configure auto-responses',
        'Test dengan sample conversations'
      ]
    },
    {
      step: 4,
      title: 'Launch & Monitor',
      description: 'Aktifkan dan monitor performa WhatsApp chatbot Anda',
      icon: BarChart3,
      details: [
        'Go live dengan customers',
        'Monitor real-time analytics',
        'Optimize berdasarkan feedback',
        'Scale operations'
      ]
    }
  ]

  const messageTypes = [
    {
      type: 'Text Messages',
      icon: MessageSquare,
      description: 'Auto-replies untuk pertanyaan umum',
      example: 'Halo! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu?',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'Media Messages',
      icon: Image,
      description: 'Kirim gambar produk, brosur, atau video tutorial',
      example: 'Berikut katalog produk terbaru kami:',
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'Document Messages',
      icon: FileText,
      description: 'Bagikan invoice, receipt, atau dokumentasi',
      example: 'Invoice #12345 telah dikirim. Silakan download attachment.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'Interactive Buttons',
      icon: Send,
      description: 'Button templates untuk quick actions',
      example: 'Pilih menu:\n1. Cek Status Pesanan\n2. Info Produk\n3. Hubungi CS',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const useCases = [
    {
      industry: 'E-commerce',
      icon: Database,
      cases: [
        'Order status tracking',
        'Product recommendations',
        'Payment confirmations',
        'Shipping notifications',
        'Customer support'
      ],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      industry: 'Service Business',
      icon: HeadphonesIcon,
      cases: [
        'Appointment booking',
        'Service inquiries',
        'Feedback collection',
        'Reminders & notifications',
        'Live chat support'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      industry: 'Healthcare',
      icon: Shield,
      cases: [
        'Appointment reminders',
        'Medical consultations',
        'Lab result notifications',
        'Medication reminders',
        'Emergency contacts'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      industry: 'Education',
      icon: Globe,
      cases: [
        'Course information',
        'Class schedules',
        'Assignment reminders',
        'Student support',
        'Parent communication'
      ],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const benefits = [
    {
      metric: '45%',
      label: 'Peningkatan response rate',
      icon: TrendingUp
    },
    {
      metric: '3x',
      label: 'Faster customer service',
      icon: Zap
    },
    {
      metric: '70%',
      label: 'Pengurangan operational cost',
      icon: Target
    },
    {
      metric: '24/7',
      label: 'Automated support',
      icon: Clock
    }
  ]

  const testimonials = [
    {
      name: 'Ahmad Hidayat',
      role: 'Operations Manager',
      company: 'Fashion E-Commerce',
      content: 'WhatsApp chatbot 7connect mengubah cara kami handle customer inquiries. Response time turun dari hours ke seconds!',
      rating: 5
    },
    {
      name: 'Rina Sari',
      role: 'Customer Service Lead',
      company: 'Healthcare Clinic',
      content: 'Patients bisa booking appointments 24/7 melalui WhatsApp. Staff kami fokus ke cases yang lebih kompleks.',
      rating: 5
    },
    {
      name: 'Budi Pratama',
      role: 'Founder',
      company: 'Online Education Platform',
      content: 'AI chatbot membantu jawab ribuan pertanyaan murid setiap hari. Sangat membantu scale operations kami.',
      rating: 5
    }
  ]

  const pricing = [
    {
      name: 'Basic',
      price: 'Rp 499K',
      period: '/bulan',
      description: 'Untuk business kecil',
      features: [
        '1,000 messages/bulan',
        'Basic AI chatbot',
        'WhatsApp Business API',
        'Simple analytics',
        'Email support'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: 'Rp 1.299K',
      period: '/bulan',
      description: 'Untuk growing business',
      features: [
        '10,000 messages/bulan',
        'Advanced AI chatbot',
        'Multi-language support',
        'Interactive templates',
        'Advanced analytics',
        'Priority support'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Untuk large scale',
      features: [
        'Unlimited messages',
        'Custom AI training',
        'Dedicated support',
        'Custom integrations',
        'SLA guarantee',
        'On-premise option'
      ],
      highlighted: false
    }
  ]

  const faqs = [
    {
      question: 'Apa itu WhatsApp Business API?',
      answer: 'WhatsApp Business API adalah resmi API dari WhatsApp yang memungkinkan businesses untuk berkomunikasi dengan customers secara programmatis. Beda dengan WhatsApp Business app yang hanya untuk device tunggal.'
    },
    {
      question: 'Apakah perlu verified business untuk menggunakan API?',
      answer: 'Ya, Anda perlu memiliki verified business account (Meta Verified) untuk bisa menggunakan WhatsApp Business API. Kami bisa bantu proses verifikasinya.'
    },
    {
      question: 'Bagaimana cara mendapatkan API credentials?',
      answer: 'Anda bisa apply melalui verified Business Service Provider (BSP) seperti kami. Prosesnya include business verification, phone number verification, dan setup technical requirements.'
    },
    {
      question: 'Apakah chatbot bisa handle complex conversations?',
      answer: 'Ya, AI chatbot kami menggunakan NLP canggih yang bisa understand context, handle multi-turn conversations, dan recognize customer intent. Bisa juga handoff ke human agent jika needed.'
    },
    {
      question: 'Bagaimana dengan message limits?',
      answer: 'WhatsApp memiliki rate limits untuk prevent spam. Kami manage ini secara otomatis dan implement best practices untuk ensure deliverability. Limits vary berdasarkan quality rating.'
    },
    {
      question: 'Apakah bisa integrate dengan existing systems?',
      answer: 'Ya, kami menyediakan RESTful API dan webhooks untuk integrate dengan CRM, inventory systems, payment gateways, dan existing business systems Anda.'
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
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              WhatsApp Business Chatbot
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Platform WhatsApp Business API dengan AI chatbot untuk customer service automation.
              Sederhanakan komunikasi dengan pelanggan melalui platform favorit mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                <HeadphonesIcon className="w-5 h-5 mr-2" />
                WhatsApp API Consultation
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

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Setup WhatsApp Business API
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              4 langkah sederhana untuk launch WhatsApp chatbot untuk bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                )}
                <Card className="h-full border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message Types */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rich Message Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Berbagai jenis pesan untuk komunikasi yang efektif dengan pelanggan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {messageTypes.map((message, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${message.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <message.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{message.type}</h3>
                      <p className="text-gray-600 mb-3">{message.description}</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700 font-mono">{message.example}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Use Cases by Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solusi WhatsApp chatbot untuk berbagai jenis bisnis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-lg flex items-center justify-center`}>
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{useCase.industry}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {useCase.cases.map((caseItem, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {caseItem}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fitur lengkap untuk WhatsApp Business automation
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Indonesian Businesses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat bagaimana WhatsApp chatbot kami transform customer service
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

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              WhatsApp Business Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Paket transparan yang sesuai dengan kebutuhan bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
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
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
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

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              WhatsApp Business FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan umum tentang WhatsApp Business API
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your WhatsApp Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see how AI-powered WhatsApp automation can grow your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <Phone className="w-5 h-5 mr-2" />
              Schedule WhatsApp Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default WhatsAppPage