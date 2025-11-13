'use client'

import { useState } from 'react'
import {
  Code,
  Download,
  Globe,
  Zap,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Play,
  ChevronDown,
  ChevronUp,
  Bot,
  MessageSquare,
  Settings,
  Key,
  Rocket,
  Target,
  Upload,
  Monitor,
  Smartphone,
  Lock,
  Database,
  Palette,
  Search,
  TrendingUp,
  HeadphonesIcon,
  FileText,
  Plugin
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const WordPressPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const features = [
    {
      icon: Upload,
      title: 'One-Click Installation',
      description: 'Install plugin langsung dari WordPress directory atau upload file ZIP'
    },
    {
      icon: Key,
      title: 'Easy API Key Setup',
      description: 'Connect dengan Chatzwa platform menggunakan API key yang simple'
    },
    {
      icon: Palette,
      title: 'Customizable Widget',
      description: 'Desain chat widget sesuai brand dan preferensi Anda'
    },
    {
      icon: Monitor,
      title: 'Responsive Design',
      description: 'Tampilan sempurna di desktop, tablet, dan mobile devices'
    },
    {
      icon: Search,
      title: 'SEO Friendly',
      description: 'Optimized untuk SEO dengan minimal impact pada page speed'
    },
    {
      icon: Lock,
      title: 'Secure & Reliable',
      description: 'WordPress security best practices dengan regular updates'
    }
  ]

  const installationSteps = [
    {
      step: 1,
      title: 'Download Plugin',
      description: 'Download Chatzwa Chatbot Plugin dari WordPress.org atau dashboard kami',
      icon: Download,
      details: [
        'Go to WordPress.org/plugins/Chatzwa-chatbot',
        'Atau download dari customer dashboard',
        'Save file ZIP ke komputer Anda',
        'File size: ~2MB'
      ]
    },
    {
      step: 2,
      title: 'Install Plugin',
      description: 'Upload dan install plugin di WordPress dashboard Anda',
      icon: Upload,
      details: [
        'Login ke WordPress admin',
        'Go to Plugins > Add New',
        'Click "Upload Plugin"',
        'Choose file ZIP yang di-download'
      ]
    },
    {
      step: 3,
      title: 'Activate Plugin',
      description: 'Aktifkan plugin dan configure basic settings',
      icon: Settings,
      details: [
        'Click "Activate Plugin" setelah upload',
        'Plugin akan muncul di activated plugins list',
        'Go to Chatzwa Chatbot settings',
        'Configure basic preferences'
      ]
    },
    {
      step: 4,
      title: 'Connect API Key',
      description: 'Hubungkan dengan Chatzwa platform menggunakan API key',
      icon: Key,
      details: [
        'Get API key dari Chatzwa dashboard',
        'Enter API key di plugin settings',
        'Save dan test connection',
        'Chat widget siap digunakan'
      ]
    }
  ]

  const customizations = [
    {
      category: 'Appearance',
      icon: Palette,
      options: [
        'Widget colors & themes',
        'Logo & branding',
        'Font preferences',
        'Button styles',
        'Chat bubble design',
        'Background colors'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Positioning',
      icon: Monitor,
      options: [
        'Bottom right/left corner',
        'Fixed or floating positioning',
        'Mobile responsiveness',
        'Animation effects',
        'Z-index control',
        'Viewport behavior'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Behavior',
      icon: Settings,
      options: [
        'Auto-open timing',
        'Proactive messages',
        'Office hours setting',
        'Offline mode',
        'Sound notifications',
        'Chat persistence'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'Advanced',
      icon: Code,
      options: [
        'Custom CSS injection',
        'JavaScript callbacks',
        'Webhook integrations',
        'User data capture',
        'Analytics tracking',
        'Multi-language support'
      ],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const technicalSpecs = [
    {
      category: 'Requirements',
      specs: [
        'WordPress 5.0+',
        'PHP 7.4+',
        'MySQL 5.6+',
        'HTTPS enabled (recommended)',
        'Memory: 64MB minimum',
        'cURL enabled'
      ]
    },
    {
      category: 'Performance',
      specs: [
        'Page load impact: <100ms',
        'JavaScript size: <200KB',
        'API response time: <500ms',
        '99.9% uptime SLA',
        'CDN optimized assets',
        'Lazy loading enabled'
      ]
    },
    {
      category: 'Security',
      specs: [
        'WordPress coding standards',
        'Data encryption in transit',
        'Regular security audits',
        'Vulnerability scanning',
        'GDPR compliant',
        'Input sanitization'
      ]
    },
    {
      category: 'Compatibility',
      specs: [
        'All modern browsers',
        'Mobile responsive',
        'Page builders compatible',
        'Multi-site networks',
        'WooCommerce ready',
        'Translation ready'
      ]
    }
  ]

  const useCases = [
    {
      type: 'E-commerce Stores',
      description: 'Product recommendations, order tracking, customer support',
      icon: Database,
      color: 'from-blue-500 to-indigo-500',
      examples: ['WooCommerce', 'Easy Digital Downloads', 'WP E-commerce']
    },
    {
      type: 'Service Businesses',
      description: 'Lead generation, appointment booking, consultation requests',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      examples: ['Consulting', 'Agencies', 'Freelancers']
    },
    {
      type: 'Content Sites',
      description: 'Reader engagement, content recommendations, feedback collection',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      examples: ['Blogs', 'News sites', 'Magazines']
    },
    {
      type: 'Educational Platforms',
      description: 'Student support, course information, enrollment assistance',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      examples: ['Online courses', 'Schools', 'Training centers']
    }
  ]

  const benefits = [
    {
      metric: '40%',
      label: 'Increase in lead generation',
      icon: TrendingUp
    },
    {
      metric: '60%',
      label: 'Faster customer response',
      icon: Zap
    },
    {
      metric: '24/7',
      label: 'Website visitor support',
      icon: Clock
    },
    {
      metric: '5min',
      label: 'Setup time',
      icon: Rocket
    }
  ]

  const testimonials = [
    {
      name: 'David Kusuma',
      role: 'WordPress Developer',
      company: 'Digital Agency',
      content: 'Plugin-nya sangat mudah diinstall dan customize. Floating chat muncul sempurna di website client kami tanpa affecting performance.',
      rating: 5
    },
    {
      name: 'Siti Nurhaliza',
      role: 'E-commerce Manager',
      company: 'Online Store',
      content: 'Customer kami lebih puas dengan instant chat support. Konversi meningkat 35% setelah install plugin ini.',
      rating: 5
    },
    {
      name: 'Rizky Ahmad',
      role: 'Content Creator',
      company: 'Educational Blog',
      content: 'Plugin yang user-friendly. Bisa customize tampilan chat widget sesuai brand website kami. Support team juga sangat helpful.',
      rating: 5
    }
  ]

  const pricing = [
    {
      name: 'Free',
      price: 'Gratis',
      period: '',
      description: 'Untuk website dengan traffic rendah',
      features: [
        'Up to 500 chats/month',
        'Basic AI chatbot',
        'Standard themes',
        'Email support',
        'WordPress updates'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: 'Rp 199K',
      period: '/bulan',
      description: 'Untuk growing websites',
      features: [
        'Unlimited chats',
        'Advanced AI chatbot',
        'Custom themes & branding',
        'Priority support',
        'Advanced analytics',
        'Multi-site license'
      ],
      highlighted: true
    },
    {
      name: 'Developer',
      price: 'Rp 499K',
      period: '/bulan',
      description: 'Untuk agencies & developers',
      features: [
        'All Professional features',
        'White-label option',
        'Client management dashboard',
        'Dedicated support',
        'API access',
        'Unlimited sites'
      ],
      highlighted: false
    }
  ]

  const faqs = [
    {
      question: 'Apakah plugin ini compatible dengan WordPress versi terbaru?',
      answer: 'Ya, plugin kami selalu update untuk compatible dengan WordPress versi terbaru. Kami juga support beberapa versi sebelumnya untuk compatibility.'
    },
    {
      question: 'Bagaimana cara mendapatkan API key?',
      answer: 'Anda bisa signup gratis di Chatzwa platform untuk mendapatkan API key. Setelah signup, Anda akan mendapatkan dashboard access untuk generate API keys.'
    },
    {
      question: 'Apakah plugin mengganggu website performance?',
      answer: 'Tidak, plugin kami optimized untuk performance. JavaScript diload asynchronously dan assets di-serve via CDN. Impact pada page load time minimal.'
    },
    {
      question: 'Bisakah customize tampilan chat widget?',
      answer: 'Ya, plugin menyediakan berbagai customization options: colors, themes, positioning, behavior, dan advanced CSS untuk custom styling.'
    },
    {
      question: 'Apakah plugin bekerja dengan page builders?',
      answer: 'Ya, plugin compatible dengan popular page builders seperti Elementor, Divi, Beaver Builder, dan Gutenberg blocks.'
    },
    {
      question: 'Bagaimana dengan security dan privacy?',
      answer: 'Plugin kami mengikuti WordPress security best practices. Data dienkripsi dan kami compliant dengan GDPR dan privacy regulations.'
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
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Chatzwa WordPress Plugin
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Plugin WordPress yang mudah untuk mengintegrasikan AI chatbot ke website Anda.
              Install plugin, koneksikan API key, dan floating chat siap digunakan!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                <Download className="w-5 h-5 mr-2" />
                Download Free Plugin
              </Button>
              <Button variant="outline" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Installation Guide
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

      {/* Installation Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              4 Langkah Mudah Install Plugin
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Setup WordPress chatbot plugin dalam waktu kurang dari 5 menit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {installationSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < installationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}
                <Card className="h-full border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
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

      {/* Key Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plugin Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fitur lengkap untuk WordPress chatbot integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
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

      {/* Customization Options */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customization Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sesuaikan chat widget dengan brand dan preferensi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {customizations.map((custom, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${custom.color} rounded-lg flex items-center justify-center`}>
                      <custom.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{custom.category}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {custom.options.map((option, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Various Website Types
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plugin yang cocok untuk berbagai jenis WordPress websites
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${useCase.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.type}</h3>
                      <p className="text-gray-600 mb-3">{useCase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.examples.map((example, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plugin yang robust dan optimized untuk performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{spec.category}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {spec.specs.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by WordPress Users
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat bagaimana plugin kami membantu website WordPress di Indonesia
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
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              WordPress Plugin Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Paket yang sesuai dengan kebutuhan website Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`${plan.highlighted ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'}`}>
                <CardContent className="p-6">
                  {plan.highlighted && (
                    <div className="text-center mb-4">
                      <Badge className="bg-blue-500 text-white">POPULER</Badge>
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
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Download Plugin' : plan.name === 'Developer' ? 'Contact Sales' : 'Start Free Trial'}
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
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              WordPress Plugin FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan umum tentang WordPress plugin kami
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Add AI Chatbot to Your WordPress Site?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Download the free plugin today and start engaging your website visitors with AI-powered chat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Download className="w-5 h-5 mr-2" />
              Download Free Plugin
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Globe className="w-5 h-5 mr-2" />
              View on WordPress.org
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default WordPressPage