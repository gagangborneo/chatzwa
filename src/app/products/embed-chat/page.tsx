'use client'

import { useState } from 'react'
import {
  Code,
  Copy,
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
  Smartphone,
  Monitor,
  Lock,
  Database,
  Palette,
  Search,
  TrendingUp,
  HeadphonesIcon,
  FileText,
  Code2,
  GitBranch,
  Webhook,
  Cloud,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const EmbedChatPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const features = [
    {
      icon: Code2,
      title: 'Simple JavaScript Integration',
      description: 'Embed chat widget dengan hanya satu line of code'
    },
    {
      icon: Monitor,
      title: 'Cross-Platform Compatible',
      description: 'Bekerja sempurna di semua modern websites dan applications'
    },
    {
      icon: Palette,
      title: 'Full Customization',
      description: 'Kustomisasi tampilan dan behavior sesuai kebutuhan'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized untuk performance dengan minimal impact'
    },
    {
      icon: Cloud,
      title: 'Cloud-Based Infrastructure',
      description: 'Scalable dan reliable dengan 99.9% uptime SLA'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'End-to-end encryption dengan security best practices'
    }
  ]

  const integrationSteps = [
    {
      step: 1,
      title: 'Get API Key',
      description: 'Daftar di 7connect platform dan generate API key',
      icon: Key,
      code: `// Get your API key from dashboard
const API_KEY = 'your-api-key-here';`
    },
    {
      step: 2,
      title: 'Add Script Tag',
      description: 'Embed JavaScript ke HTML website Anda',
      icon: Code,
      code: `<script src="https://chat.7connect.id/widget.js"
        data-api-key="your-api-key-here"
        data-position="bottom-right"
        async></script>`
    },
    {
      step: 3,
      title: 'Customize Options',
      description: 'Konfigurasi widget sesuai preferensi Anda',
      icon: Settings,
      code: `// Advanced configuration
window.7connectWidget = {
  position: 'bottom-right',
  primaryColor: '#10b981',
  welcomeMessage: 'Halo! Ada yang bisa kami bantu?',
  autoOpen: true,
  delay: 5000
};`
    },
    {
      step: 4,
      title: 'Launch & Monitor',
      description: 'Widget aktif dan monitor performance',
      icon: Eye,
      code: `// Monitor performance
// Check dashboard for analytics
// Optimize based on insights`
    }
  ]

  const codeExamples = [
    {
      title: 'Basic Integration',
      description: 'Embed chat widget dengan konfigurasi dasar',
      language: 'html',
      code: `<!DOCTYPE html>
<html>
<head>
    <title>Your Website</title>
</head>
<body>
    <h1>Welcome to Our Website</h1>

    <!-- 7connect Chat Widget -->
    <script src="https://chat.7connect.id/widget.js"
            data-api-key="your-api-key-here"
            async></script>
</body>
</html>`,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'React Integration',
      description: 'Integrate dengan React applications',
      language: 'javascript',
      code: `import React, { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://chat.7connect.id/widget.js';
    script.setAttribute('data-api-key', 'your-api-key-here');
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default ChatWidget;`,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Vue.js Integration',
      description: 'Integrate dengan Vue.js applications',
      language: 'javascript',
      code: `<template>
  <div>
    <h1>Your Vue App</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    this.loadChatWidget();
  },
  methods: {
    loadChatWidget() {
      const script = document.createElement('script');
      script.src = 'https://chat.7connect.id/widget.js';
      script.setAttribute('data-api-key', 'your-api-key-here');
      script.async = true;
      document.body.appendChild(script);
    }
  }
}
</script>`,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Advanced Configuration',
      description: 'Konfigurasi lanjutan dengan options',
      language: 'javascript',
      code: `window.7connectWidget = {
  apiKey: 'your-api-key-here',
  position: 'bottom-right',
  primaryColor: '#10b981',
  secondaryColor: '#ffffff',
  welcomeMessage: 'Halo! Ada yang bisa kami bantu?',
  autoOpen: true,
  delay: 5000,
  hideOnMobile: false,
  showEmail: true,
  showPhone: false,
  customCSS: \`.chat-widget {
    border-radius: 12px;
  }\`
};`,
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const customizationOptions = [
    {
      category: 'Positioning',
      options: [
        'bottom-right (default)',
        'bottom-left',
        'top-right',
        'top-left',
        'custom coordinates',
        'responsive positioning'
      ],
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Colors & Theme',
      options: [
        'Primary/secondary colors',
        'Dark/light themes',
        'Custom CSS injection',
        'Brand colors',
        'Gradient backgrounds',
        'Button styles'
      ],
      icon: Palette,
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'Behavior',
      options: [
        'Auto-open timing',
        'Welcome messages',
        'Offline mode',
        'Sound notifications',
        'Chat persistence',
        'Session management'
      ],
      icon: Settings,
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'Data Collection',
      options: [
        'User information capture',
        'Lead generation forms',
        'Feedback collection',
        'Analytics tracking',
        'Custom metadata',
        'CRM integration'
      ],
      icon: Database,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const platforms = [
    {
      name: 'Static Websites',
      icon: Globe,
      description: 'HTML, CSS, JavaScript websites',
      examples: ['Personal blogs', 'Portfolio sites', 'Landing pages'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Single Page Apps',
      icon: Code2,
      description: 'React, Vue, Angular applications',
      examples: ['React apps', 'Vue.js apps', 'Angular apps'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'E-commerce Platforms',
      icon: Target,
      description: 'Shopify, Magento, custom stores',
      examples: ['Shopify stores', 'Custom carts', 'Marketplace platforms'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Web Applications',
      icon: Cloud,
      description: 'SaaS platforms, dashboards',
      examples: ['CRM systems', 'Analytics dashboards', 'Admin panels'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const benefits = [
    {
      metric: '50%',
      label: 'Increase in engagement',
      icon: TrendingUp
    },
    {
      metric: '2min',
      label: 'Setup time',
      icon: Rocket
    },
    {
      metric: '100ms',
      label: 'Load time impact',
      icon: Zap
    },
    {
      metric: '99.9%',
      label: 'Uptime SLA',
      icon: Shield
    }
  ]

  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'Full Stack Developer',
      company: 'SaaS Startup',
      content: 'Integration dengan React app sangat smooth. Widget langsung muncul dan performance-nya excellent.',
      rating: 5
    },
    {
      name: 'Maria Rodriguez',
      role: 'Web Developer',
      company: 'Digital Agency',
      content: 'Customization options sangat fleksible. Bisa match dengan brand client kami perfectly.',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Technical Lead',
      company: 'E-commerce Platform',
      content: 'Documentation yang jelas dan support team sangat helpful. Integration process sangat smooth.',
      rating: 5
    }
  ]

  const pricing = [
    {
      name: 'Starter',
      price: 'Rp 299K',
      period: '/bulan',
      description: 'Untuk websites dengan traffic rendah',
      features: [
        'Up to 10,000 chats/month',
        'Basic customization',
        'Email support',
        'Standard analytics',
        'Single domain'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: 'Rp 799K',
      period: '/bulan',
      description: 'Untuk growing applications',
      features: [
        'Up to 100,000 chats/month',
        'Advanced customization',
        'Priority support',
        'Advanced analytics',
        'Multi-domain',
        'API access'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Untuk large scale applications',
      features: [
        'Unlimited chats',
        'White-label solution',
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
      question: 'Apakah embed chat widget mengganggu website performance?',
      answer: 'Tidak, widget kami optimized untuk performance. JavaScript diload asynchronously dengan impact minimal (<50ms) pada page load time.'
    },
    {
      question: 'Platform apa saja yang compatible dengan embed chat?',
      answer: 'Widget compatible dengan semua modern platforms: React, Vue, Angular, vanilla JavaScript, WordPress, Shopify, dan custom applications.'
    },
    {
      question: 'Bisakah customize tampilan widget?',
      answer: 'Ya, kami menyediakan berbagai customization options: colors, positioning, behavior, dan custom CSS untuk advanced styling.'
    },
    {
      question: 'Apakah data pengguna aman?',
      answer: 'Ya, semua data dienkripsi end-to-end dan kami compliance dengan GDPR, CCPA, dan privacy regulations lainnya.'
    },
    {
      question: 'Bagaimana cara monitor performa widget?',
      answer: 'Anda bisa monitor performa melalui dashboard 7connect dengan real-time analytics, conversation data, dan user behavior insights.'
    },
    {
      question: 'Apakah bisa integrate dengan existing systems?',
      answer: 'Ya, kami menyediakan RESTful API dan webhooks untuk integrate dengan CRM, analytics, dan existing business systems.'
    }
  ]

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

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
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Embed Chat Widget
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Sederhanakan integrasi AI chatbot ke website atau aplikasi Anda.
              Cukup tambahkan script dan widget siap digunakan!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Code2 className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
              <Button variant="outline" size="lg">
                <Play className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{benefit.metric}</div>
                <div className="text-sm text-gray-600">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              4 Langkah Integrasi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Setup embed chat widget dalam waktu kurang dari 2 menit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < integrationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                )}
                <Card className="h-full border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="bg-gray-900 rounded-lg p-3 text-xs text-green-400 font-mono overflow-x-auto">
                      <pre>{step.code}</pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Code Examples
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contoh integrasi untuk berbagai platforms dan use cases
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {codeExamples.map((example, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${example.color} rounded-lg flex items-center justify-center`}>
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                        <p className="text-sm text-gray-600">{example.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(example.code, `code-${index}`)}
                    >
                      {copiedCode === `code-${index}` ? 'Copied!' : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 font-mono overflow-x-auto max-h-96 overflow-y-auto">
                    <pre>{example.code}</pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fitur lengkap untuk embed chat integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
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
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customization Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sesuaikan widget dengan brand dan preferensi Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {customizationOptions.map((custom, index) => (
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

      {/* Platforms */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compatible Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Widget yang compatible dengan berbagai platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((platform, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{platform.name}</h3>
                      <p className="text-gray-600 mb-3">{platform.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {platform.examples.map((example, i) => (
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

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat bagaimana embed chat kami membantu developers worldwide
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
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
              Embed Chat Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Paket yang sesuai dengan kebutuhan website Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`${plan.highlighted ? 'border-2 border-purple-500 shadow-lg' : 'border border-gray-200'}`}>
                <CardContent className="p-6">
                  {plan.highlighted && (
                    <div className="text-center mb-4">
                      <Badge className="bg-purple-500 text-white">POPULER</Badge>
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
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get API Key'}
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
              Embed Chat FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan umum tentang embed chat integration
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
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Embed AI Chat in Your Website?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get your API key today and start engaging your website visitors with AI-powered conversations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              <Key className="w-5 h-5 mr-2" />
              Get Your API Key
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
              <FileText className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default EmbedChatPage