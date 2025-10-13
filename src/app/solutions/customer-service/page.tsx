'use client'

import { useState } from 'react'
import {
  Users,
  Headphones,
  MessageCircle,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Target,
  Award,
  ArrowRight,
  Play,
  ChevronDown,
  ChevronUp,
  Bot,
  Smartphone,
  Globe,
  Database,
  FileText,
  Settings,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  TrendingDown,
  AlertCircle,
  ThumbsUp,
  Smile,
  Frown
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const CustomerServicePage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const benefits = [
    {
      icon: TrendingDown,
      title: '80% Reduction',
      description: 'Pengurangan biaya operasional customer service',
      value: '80%',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Pelayanan tanpa henti tanpa tambahan staff',
      value: '24/7',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'Respon waktu dari hours ke seconds',
      value: '<1s',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: '3x Satisfaction',
      description: 'Peningkatan kepuasan pelanggan',
      value: '3x',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Responses',
      description: 'Chatbot AI yang memahami konteks dan memberikan jawaban akurat',
      benefits: [
        'Natural Language Understanding',
        'Context awareness',
        'Multi-intent recognition',
        'Sentiment analysis'
      ]
    },
    {
      icon: Users,
      title: 'Smart Escalation',
      description: 'Auto-escalate ke human agent untuk complex cases',
      benefits: [
        'Intelligent routing',
        'Priority queuing',
        'Agent availability check',
        'Seamless handoff'
      ]
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Dashboard analytics untuk insight customer behavior',
      benefits: [
        'Conversation analytics',
        'Agent performance metrics',
        'Customer satisfaction tracking',
        'Trend analysis'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Multi-channel Support',
      description: 'Satu platform untuk semua customer communication channels',
      benefits: [
        'WhatsApp integration',
        'Website chat widget',
        'Email support',
        'Social media DMs'
      ]
    },
    {
      icon: Database,
      title: 'Knowledge Base Management',
      description: 'Centralized knowledge base untuk consistent responses',
      benefits: [
        'Dynamic knowledge updates',
        'Version control',
        'Search optimization',
        'Multi-language support'
      ]
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Security compliance dan data protection',
      benefits: [
        'End-to-end encryption',
        'GDPR compliance',
        'Access controls',
        'Audit trails'
      ]
    }
  ]

  const useCases = [
    {
      title: 'Product Information',
      icon: FileText,
      description: 'Jawab pertanyaan tentang produk, fitur, dan harga',
      examples: [
        'Product specifications',
        'Pricing information',
        'Feature comparisons',
        'Availability status'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Order Support',
      icon: Target,
      description: 'Bantu pelanggan dengan order-related inquiries',
      examples: [
        'Order status tracking',
        'Payment issues',
        'Shipping information',
        'Return & refund requests'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Technical Support',
      icon: Settings,
      description: 'Resolusi technical issues dan troubleshooting',
      examples: [
        'Setup assistance',
        'Troubleshooting guides',
        'FAQ automation',
        'Bug reporting'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'General Inquiries',
      icon: MessageCircle,
      description: 'Handle general customer questions and feedback',
      examples: [
        'Business hours info',
        'Contact information',
        'Company policies',
        'Feedback collection'
      ],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const comparison = [
    {
      aspect: 'Response Time',
      traditional: '4-8 hours',
      aiSolution: '<1 second',
      improvement: '99.9% faster'
    },
    {
      aspect: 'Operating Hours',
      traditional: '8-10 hours/day',
      aiSolution: '24/7',
      improvement: '2.4x more coverage'
    },
    {
      aspect: 'Cost per Inquiry',
      traditional: 'Rp 50,000 - 100,000',
      aiSolution: 'Rp 5,000 - 10,000',
      improvement: '90% cost reduction'
    },
    {
      aspect: 'Customer Satisfaction',
      traditional: '65-75%',
      aiSolution: '85-95%',
      improvement: '25% higher satisfaction'
    },
    {
      aspect: 'Scalability',
      traditional: 'Limited by staff',
      aiSolution: 'Unlimited',
      improvement: 'Infinite scalability'
    },
    {
      aspect: 'Consistency',
      traditional: 'Varies by agent',
      aiSolution: '100% consistent',
      improvement: 'Complete consistency'
    }
  ]

  const industries = [
    {
      name: 'E-commerce',
      icon: Database,
      description: 'Handle thousands of product inquiries, order tracking, and customer support',
      challenges: ['High volume inquiries', 'Order status requests', 'Product recommendations', 'Return processing'],
      solutions: ['Product knowledge base', 'Order tracking integration', 'Personalized recommendations', 'Automated returns'],
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Banking & Finance',
      icon: Shield,
      description: 'Provide secure financial information and account support 24/7',
      challenges: ['Security compliance', 'Account inquiries', 'Transaction support', 'Regulatory requirements'],
      solutions: ['Secure authentication', 'Account information access', 'Transaction assistance', 'Compliance automation'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Healthcare',
      icon: Users,
      description: 'Support patient inquiries, appointments, and medical information requests',
      challenges: ['Patient privacy', 'Appointment scheduling', 'Medical information', 'Emergency handling'],
      solutions: ['HIPAA compliance', 'Appointment booking', 'General health info', 'Emergency routing'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Telecommunications',
      icon: Smartphone,
      description: 'Handle service inquiries, technical support, and account management',
      challenges: ['Technical troubleshooting', 'Plan information', 'Billing inquiries', 'Service outages'],
      solutions: ['Diagnostic automation', 'Plan comparisons', 'Billing assistance', 'Outage notifications'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      role: 'Customer Service Manager',
      company: 'E-commerce Store',
      content: 'AI chatbot mengubah customer service kami. Response time turun drastis dan team kami fokus ke complex cases.',
      rating: 5,
      improvement: '85% cost reduction'
    },
    {
      name: 'Budi Santoso',
      role: 'Operations Director',
      company: 'Banking Institution',
      content: 'Customer satisfaction meningkat 35% setelah implement AI chatbot. Support 24/7 tanpa additional cost.',
      rating: 5,
      improvement: '40% satisfaction increase'
    },
    {
      name: 'Maya Putri',
      role: 'Customer Experience Lead',
      company: 'Telecom Provider',
      content: 'Team kami handle 3x more customers dengan AI assistance. Employee turnover juga berkurang signifikan.',
      rating: 5,
      improvement: '3x efficiency increase'
    }
  ]

  const pricing = [
    {
      name: 'Startup',
      price: 'Rp 799K',
      period: '/bulan',
      description: 'Untuk growing customer service teams',
      features: [
        'Up to 2,000 conversations/month',
        'AI chatbot with basic NLP',
        'WhatsApp integration',
        'Email support',
        'Basic analytics',
        'Knowledge base (100 articles)'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: 'Rp 2.499K',
      period: '/bulan',
      description: 'Untuk established customer service operations',
      features: [
        'Up to 10,000 conversations/month',
        'Advanced AI with machine learning',
        'Multi-channel integration',
        'Priority support',
        'Advanced analytics & reporting',
        'Knowledge base (500 articles)',
        'Custom training',
        'API access'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Untuk large-scale customer service operations',
      features: [
        'Unlimited conversations',
        'Enterprise AI with custom models',
        'All integrations & custom APIs',
        'Dedicated account manager',
        'Advanced analytics with BI tools',
        'Unlimited knowledge base',
        'Custom AI training & models',
        'On-premise deployment option',
        'SLA guarantee'
      ],
      highlighted: false
    }
  ]

  const faqs = [
    {
      question: 'Berapa lama waktu yang dibutuhkan untuk implement AI customer service?',
      answer: 'Setup dasar bisa dilakukan dalam 1-2 minggu. Untuk full implementation dengan custom training biasanya 4-6 minggu, tergantung complexity dan requirements.'
    },
    {
      question: 'Apakah AI chatbot bisa handle complex customer issues?',
      answer: 'AI chatbot kami handle hingga 80% dari routine inquiries. Untuk complex cases, system akan auto-escalate ke human agents dengan complete context transfer.'
    },
    {
      question: 'Bagaimana AI chatbot belajar tentang bisnis kami?',
      answer: 'AI dilatih dengan data bisnis Anda: produk, services, policies, FAQ, dan conversation histories. System continuously improves dari real conversations.'
    },
    {
      question: 'Apakah customer data aman dengan AI chatbot?',
      answer: 'Ya, semua data dienkripsi end-to-end dan kami compliance dengan GDPR, CCPA, dan industry-specific regulations seperti HIPPA untuk healthcare.'
    },
    {
      question: 'Bagaimana cara measure success dari AI customer service?',
      answer: 'Kami provide comprehensive analytics: response time, resolution rate, customer satisfaction, cost per inquiry, agent productivity, dan ROI metrics.'
    },
    {
      question: 'Bisakah integrate dengan existing customer service systems?',
      answer: 'Ya, kami integrate dengan CRM systems, help desk software, knowledge bases, dan existing customer service workflows seamlessly.'
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
              <Headphones className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              AI Customer Service Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform customer service dengan AI-powered automation.
              Berikan instant, accurate, dan personalized support 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                <Play className="w-5 h-5 mr-2" />
                Request Demo
              </Button>
              <Button variant="outline" size="lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Calculate ROI
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{benefit.value}</div>
                <div className="text-sm text-gray-600">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced AI Customer Service Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Teknologi AI terdepan untuk customer experience yang exceptional
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
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
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
              Customer Service Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Otomatisasi berbagai jenis customer inquiries dengan AI
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                      <p className="text-gray-600 mb-4">{useCase.description}</p>
                      <div className="space-y-2">
                        {useCase.examples.map((example, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {example}
                          </div>
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

      {/* Comparison */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Traditional vs AI Customer Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat perbedaan dramatis dalam performance dan efficiency
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full max-w-4xl mx-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Aspect</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Traditional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">AI Solution</th>
                  <th className="text-center py-4 px-6 font-semibold text-green-600">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.aspect}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{item.traditional}</td>
                    <td className="py-4 px-6 text-center text-gray-900 font-semibold">{item.aiSolution}</td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {item.improvement}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI customer service yang disesuaikan untuk berbagai industri
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${industry.color} rounded-lg flex items-center justify-center`}>
                      <industry.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{industry.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{industry.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Challenges</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.challenges.map((challenge, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {challenge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">AI Solutions</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.solutions.map((solution, i) => (
                        <Badge key={i} className="bg-green-100 text-green-800 text-xs">
                          {solution}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
              Customer Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lihat bagaimana AI customer service transform bisnis kami
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
                  <div className="mb-4">
                    <Badge className="bg-green-100 text-green-800">
                      {testimonial.improvement}
                    </Badge>
                  </div>
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
              Customer Service Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Paket yang sesuai dengan skala dan kebutuhan customer service Anda
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
              Customer Service FAQ
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jawaban untuk pertanyaan umum tentang AI customer service
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
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have revolutionized customer service with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <BarChart3 className="w-5 h-5 mr-2" />
              Calculate Your ROI
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CustomerServicePage