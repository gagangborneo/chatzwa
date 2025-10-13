'use client'

import { useState } from 'react'
import {
  TrendingDown,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  MessageCircle,
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/LanguageContext'

const ComparisonSection = () => {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  const getComparisonData = () => [
    {
      aspect: t('comparison.responseTime'),
      traditional: language === 'id' ? '4-8 jam' : '4-8 hours',
      ai: '<1 detik',
      improvement: language === 'id' ? '99.9% lebih cepat' : '99.9% faster',
      improvementColor: 'text-green-600',
      icon: Clock
    },
    {
      aspect: t('comparison.operatingHours'),
      traditional: language === 'id' ? '8-10 jam/hari' : '8-10 hours/day',
      ai: '24/7',
      improvement: language === 'id' ? '2.4x cakupan' : '2.4x coverage',
      improvementColor: 'text-green-600',
      icon: Clock
    },
    {
      aspect: t('comparison.costPerInquiry'),
      traditional: 'Rp 50K-100K',
      ai: 'Rp 5K-10K',
      improvement: language === 'id' ? '90% pengurangan' : '90% reduction',
      improvementColor: 'text-green-600',
      icon: DollarSign
    },
    {
      aspect: t('comparison.customerSatisfaction'),
      traditional: '65-75%',
      ai: '85-95%',
      improvement: language === 'id' ? '25% lebih tinggi' : '25% higher',
      improvementColor: 'text-green-600',
      icon: TrendingUp
    },
    {
      aspect: t('comparison.scalability'),
      traditional: language === 'id' ? 'Terbatas oleh staf' : 'Limited by staff',
      ai: language === 'id' ? 'Tidak terbatas' : 'Unlimited',
      improvement: language === 'id' ? 'Skalabilitas tak terbatas' : 'Infinite scaling',
      improvementColor: 'text-green-600',
      icon: BarChart3
    },
    {
      aspect: t('comparison.consistency'),
      traditional: language === 'id' ? 'Bervariasi per agen' : 'Varies by agent',
      ai: '100% konsisten',
      improvement: language === 'id' ? 'Konsistensi penuh' : 'Complete consistency',
      improvementColor: 'text-green-600',
      icon: Shield
    }
  ]

  const getFeatures = () => [
    {
      category: t('comparison.traditionalCategory'),
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'from-red-50 to-red-100',
      items: [
        {
          title: t('comparison.manualProcess'),
          description: t('comparison.manualProcessDesc'),
          negative: true
        },
        {
          title: t('comparison.limitedHours'),
          description: t('comparison.limitedHoursDesc'),
          negative: true
        },
        {
          title: t('comparison.inconsistentQuality'),
          description: t('comparison.inconsistentQualityDesc'),
          negative: true
        },
        {
          title: t('comparison.highCost'),
          description: t('comparison.highCostDesc'),
          negative: true
        },
        {
          title: t('comparison.scalabilityIssues'),
          description: t('comparison.scalabilityIssuesDesc'),
          negative: true
        },
        {
          title: t('comparison.slowResponse'),
          description: t('comparison.slowResponseDesc'),
          negative: true
        }
      ]
    },
    {
      category: t('comparison.aiCategory'),
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'from-green-50 to-emerald-100',
      items: [
        {
          title: t('comparison.instantAutomation'),
          description: t('comparison.instantAutomationDesc'),
          negative: false
        },
        {
          title: t('comparison.availability247'),
          description: t('comparison.availability247Desc'),
          negative: false
        },
        {
          title: t('comparison.consistentQuality'),
          description: t('comparison.consistentQualityDesc'),
          negative: false
        },
        {
          title: t('comparison.costEffective'),
          description: t('comparison.costEffectiveDesc'),
          negative: false
        },
        {
          title: t('comparison.infiniteScalability'),
          description: t('comparison.infiniteScalabilityDesc'),
          negative: false
        },
        {
          title: t('comparison.smartEscalation'),
          description: t('comparison.smartEscalationDesc'),
          negative: false
        }
      ]
    }
  ]

  const getBenefits = () => [
    {
      metric: '80%',
      label: t('comparison.benefit1'),
      icon: TrendingDown,
      color: 'from-green-500 to-emerald-500'
    },
    {
      metric: '3x',
      label: t('comparison.benefit2'),
      icon: TrendingUp,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      metric: '1000x',
      label: t('comparison.benefit3'),
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500'
    },
    {
      metric: '24/7',
      label: t('comparison.benefit4'),
      icon: Clock,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const getTestimonials = () => [
    {
      name: 'Sarah Wijaya',
      role: language === 'id' ? 'Manajer Layanan Pelanggan' : 'Customer Service Manager',
      company: language === 'id' ? 'Toko E-commerce' : 'E-commerce Store',
      content: language === 'id'
        ? 'AI chatbot mengubah customer service kami. Response time turun dari jam ke detik, dan tim kami fokus ke kasus kompleks.'
        : 'AI chatbot transformed our customer service. Response time dropped from hours to seconds, and our team focuses on complex cases.',
      type: 'success'
    },
    {
      name: 'Budi Santoso',
      role: language === 'id' ? 'Direktur Operasional' : 'Operations Director',
      company: language === 'id' ? 'Startup Teknologi' : 'Tech Startup',
      content: language === 'id'
        ? 'Kepuasan pelanggan meningkat 35% setelah implementasi AI. Support 24/7 tanpa biaya tambahan.'
        : 'Customer satisfaction increased 35% after AI implementation. 24/7 support without additional costs.',
      type: 'success'
    },
    {
      name: 'Rina Sari',
      role: language === 'id' ? 'Pemimpin Layanan Pelanggan' : 'Customer Service Lead',
      company: language === 'id' ? 'Lembaga Perbankan' : 'Banking Institution',
      content: language === 'id'
        ? 'Sebelum AI, kami kesulitan dengan response time. Sekarang pelanggan puas dengan support instan.'
        : 'Before AI, we struggled with response time. Now customers are satisfied with instant support.',
      type: 'before'
    },
    {
      name: 'Ahmad Hidayat',
      role: language === 'id' ? 'Pemimpin Tim Support' : 'Support Team Lead',
      company: language === 'id' ? 'Klinik Kesehatan' : 'Healthcare Clinic',
      content: language === 'id'
        ? 'Staf kami terbantu dengan AI assistance yang membantu menangani inquiry rutin.'
        : 'Our staff is supported by AI assistance that helps handle routine inquiries.',
      type: 'success'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('comparison.title')}
            </span>
            <br />
            <span className="text-gray-700">{t('comparison.subtitle')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('comparison.description')}
          </p>
        </div>

        {/* Benefits Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {getBenefits().map((benefit, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{benefit.metric}</div>
              <div className="text-sm text-gray-600">{benefit.label}</div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 text-center pt-6">
                {t('comparison.tableTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">{t('comparison.aspect')}</th>
                      <th className="text-center py-4 px-6 font-semibold text-red-600">{t('comparison.traditional')}</th>
                      <th className="text-center py-4 px-6 font-semibold text-green-600">{t('comparison.aiPowered')}</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-900">{t('comparison.improvement')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getComparisonData().map((item, index) => (
                      <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-900">{item.aspect}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{item.traditional}</td>
                        <td className="py-4 px-6 text-center font-semibold text-green-600">{item.ai}</td>
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
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {getFeatures().map((category, index) => (
            <Card key={index} className={`border ${index === 0 ? 'border-red-200' : 'border-green-200'}`}>
              <CardHeader className={`pb-4 ${index === 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <div className="flex items-center gap-3">
                  <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                  <CardTitle className={`text-lg font-semibold ${index === 0 ? 'text-red-900' : 'text-green-900'}`}>
                    {category.category}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      {item.negative ? (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('comparison.testimonialsTitle')}</h3>
            <p className="text-gray-600">
              {t('comparison.testimonialsSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {getTestimonials().map((testimonial, index) => (
              <Card key={index} className={`border ${testimonial.type === 'success' ? 'border-green-200' : 'border-gray-200'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${testimonial.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-400'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-semibold">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{testimonial.role} {language === 'id' ? 'di' : 'at'} {testimonial.company}</div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            {t('comparison.ctaTitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products/ai-chatbot"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25"
            >
              {t('comparison.cta1')}
            </a>
            <a
              href="/solutions/customer-service"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              {t('comparison.cta2')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonSection