'use client'

import { useState, useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Search,
  HelpCircle,
  MessageSquare,
  Settings,
  CreditCard,
  Shield,
  BookOpen,
  Database,
  Users,
  Smartphone,
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Video,
  FileText,
  Mail,
  Phone,
  Clock,
  Star,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export default function HelpPage() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['getting-started'])
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const faqCategories = [
    {
      id: 'getting-started',
      title: t('help.categories.gettingStarted'),
      icon: HelpCircle,
      color: 'text-blue-600',
      description: t('help.categories.gettingStartedDescription'),
      questions: [
        {
          id: 'what-is-attallah',
          question: t('help.questions.whatIsAttallah'),
          answer: t('help.answers.whatIsAttallah'),
          popular: true
        },
        {
          id: 'how-to-start',
          question: t('help.questions.howToStart'),
          answer: t('help.answers.howToStart'),
          popular: true
        },
        {
          id: 'first-message',
          question: t('help.questions.firstMessage'),
          answer: t('help.answers.firstMessage')
        },
        {
          id: 'supported-languages',
          question: t('help.questions.supportedLanguages'),
          answer: t('help.answers.supportedLanguages')
        }
      ]
    },
    {
      id: 'features',
      title: t('help.categories.features'),
      icon: Star,
      color: 'text-purple-600',
      description: t('help.categories.featuresDescription'),
      questions: [
        {
          id: 'persona-settings',
          question: t('help.questions.personaSettings'),
          answer: t('help.answers.personaSettings'),
          popular: true
        },
        {
          id: 'knowledge-base',
          question: t('help.questions.knowledgeBase'),
          answer: t('help.answers.knowledgeBase')
        },
        {
          id: 'data-sync',
          question: t('help.questions.dataSync'),
          answer: t('help.answers.dataSync')
        },
        {
          id: 'analytics',
          question: t('help.questions.analytics'),
          answer: t('help.answers.analytics')
        }
      ]
    },
    {
      id: 'account',
      title: t('help.categories.account'),
      icon: Users,
      color: 'text-green-600',
      description: t('help.categories.accountDescription'),
      questions: [
        {
          id: 'change-password',
          question: t('help.questions.changePassword'),
          answer: t('help.answers.changePassword'),
          popular: true
        },
        {
          id: 'two-factor',
          question: t('help.questions.twoFactor'),
          answer: t('help.answers.twoFactor')
        },
        {
          id: 'update-profile',
          question: t('help.questions.updateProfile'),
          answer: t('help.answers.updateProfile')
        },
        {
          id: 'delete-account',
          question: t('help.questions.deleteAccount'),
          answer: t('help.answers.deleteAccount')
        }
      ]
    },
    {
      id: 'billing',
      title: t('help.categories.billing'),
      icon: CreditCard,
      color: 'text-orange-600',
      description: t('help.categories.billingDescription'),
      questions: [
        {
          id: 'pricing-plans',
          question: t('help.questions.pricingPlans'),
          answer: t('help.answers.pricingPlans'),
          popular: true
        },
        {
          id: 'payment-methods',
          question: t('help.questions.paymentMethods'),
          answer: t('help.answers.paymentMethods')
        },
        {
          id: 'invoice-download',
          question: t('help.questions.invoiceDownload'),
          answer: t('help.answers.invoiceDownload')
        },
        {
          id: 'refund-policy',
          question: t('help.questions.refundPolicy'),
          answer: t('help.answers.refundPolicy')
        }
      ]
    },
    {
      id: 'integrations',
      title: t('help.categories.integrations'),
      icon: Globe,
      color: 'text-indigo-600',
      description: t('help.categories.integrationsDescription'),
      questions: [
        {
          id: 'whatsapp-integration',
          question: t('help.questions.whatsappIntegration'),
          answer: t('help.answers.whatsappIntegration')
        },
        {
          id: 'wordpress-plugin',
          question: t('help.questions.wordpressPlugin'),
          answer: t('help.answers.wordpressPlugin')
        },
        {
          id: 'embed-chat',
          question: t('help.questions.embedChat'),
          answer: t('help.answers.embedChat')
        },
        {
          id: 'api-access',
          question: t('help.questions.apiAccess'),
          answer: t('help.answers.apiAccess')
        }
      ]
    },
    {
      id: 'technical',
      title: t('help.categories.technical'),
      icon: Settings,
      color: 'text-gray-600',
      description: t('help.categories.technicalDescription'),
      questions: [
        {
          id: 'browser-support',
          question: t('help.questions.browserSupport'),
          answer: t('help.answers.browserSupport')
        },
        {
          id: 'mobile-app',
          question: t('help.questions.mobileApp'),
          answer: t('help.answers.mobileApp')
        },
        {
          id: 'data-security',
          question: t('help.questions.dataSecurity'),
          answer: t('help.answers.dataSecurity'),
          popular: true
        },
        {
          id: 'troubleshooting',
          question: t('help.questions.troubleshooting'),
          answer: t('help.answers.troubleshooting')
        }
      ]
    }
  ]

  const quickLinks = [
    {
      title: t('help.quickLinks.videoTutorials'),
      description: t('help.quickLinks.videoTutorialsDescription'),
      icon: Video,
      href: '#',
      color: 'text-red-600'
    },
    {
      title: t('help.quickLinks.documentation'),
      description: t('help.quickLinks.documentationDescription'),
      icon: FileText,
      href: '#',
      color: 'text-blue-600'
    },
    {
      title: t('help.quickLinks.contactSupport'),
      description: t('help.quickLinks.contactSupportDescription'),
      icon: Mail,
      href: '#',
      color: 'text-green-600'
    },
    {
      title: t('help.quickLinks.community'),
      description: t('help.quickLinks.communityDescription'),
      icon: Users,
      href: '#',
      color: 'text-purple-600'
    }
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const popularQuestions = faqCategories
    .flatMap(cat => cat.questions)
    .filter(q => q.popular)
    .slice(0, 5)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('help.title')}</h2>
          <p className="text-muted-foreground">{t('help.subtitle')}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('help.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-muted ${link.color}`}>
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{link.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Popular Questions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('help.popularQuestions')}
              </CardTitle>
              <CardDescription>{t('help.popularQuestionsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {popularQuestions.map((question, index) => (
                  <div key={question.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => toggleQuestion(question.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{question.question}</p>
                        </div>
                      </div>
                    </Button>
                    {expandedQuestions.includes(question.id) && (
                      <div className="ml-8 mt-2 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{question.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('help.faqCategories')}</CardTitle>
              <CardDescription>{t('help.faqCategoriesDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {filteredCategories.map((category) => (
                    <div key={category.id} className="border rounded-lg">
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-auto p-4 text-left"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-muted ${category.color}`}>
                            <category.icon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                            <Badge variant="secondary" className="mt-1 w-fit">
                              {category.questions.length} {t('help.questions')}
                            </Badge>
                          </div>
                        </div>
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>

                      {expandedCategories.includes(category.id) && (
                        <div className="px-4 pb-4 space-y-2">
                          {category.questions.map((question) => (
                            <div key={question.id} className="border-l-2 border-muted pl-4">
                              <Button
                                variant="ghost"
                                className="w-full justify-start h-auto p-2 text-left"
                                onClick={() => toggleQuestion(question.id)}
                              >
                                <div className="flex items-start gap-2">
                                  {question.popular && (
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-0.5" />
                                  )}
                                  <p className="text-sm">{question.question}</p>
                                </div>
                              </Button>
                              {expandedQuestions.includes(question.id) && (
                                <div className="ml-7 mt-2 p-3 bg-muted/50 rounded-lg">
                                  <p className="text-sm text-muted-foreground">{question.answer}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {t('help.stillNeedHelp')}
          </CardTitle>
          <CardDescription>{t('help.stillNeedHelpDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{t('help.emailSupport')}</h4>
                <p className="text-sm text-muted-foreground">support@attallah.id</p>
                <p className="text-xs text-muted-foreground">{t('help.responseTime')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">{t('help.phoneSupport')}</h4>
                <p className="text-sm text-muted-foreground">+62 21 1234 5678</p>
                <p className="text-xs text-muted-foreground">{t('help.supportHours')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">{t('help.liveChat')}</h4>
                <p className="text-sm text-muted-foreground">{t('help.availableNow')}</p>
                <Button variant="outline" size="sm" className="mt-1">
                  {t('help.startChat')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}