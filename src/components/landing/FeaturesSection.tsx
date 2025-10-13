'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  MessageSquare,
  Phone,
  Video,
  Bot,
  Shield,
  Zap,
  Globe,
  BarChart,
  Code,
  Database,
  Cloud,
  Lock,
  Smartphone,
  Mail,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const FeaturesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [activeTab, setActiveTab] = useState('messaging')

  const features = {
    messaging: [
      {
        icon: MessageSquare,
        title: 'Multi-Channel Messaging',
        description: 'Connect with customers across WhatsApp, SMS, Messenger, and more from a single platform.',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: Bot,
        title: 'AI-Powered Chatbots',
        description: 'Intelligent chatbots that understand context, provide instant responses, and learn from interactions.',
        gradient: 'from-purple-500 to-pink-500'
      },
      {
        icon: Globe,
        title: 'Global Reach',
        description: 'Send messages to customers worldwide with reliable delivery and local number support.',
        gradient: 'from-green-500 to-emerald-500'
      }
    ],
    voice: [
      {
        icon: Phone,
        title: 'Voice Calls',
        description: 'High-quality voice calls with HD audio, call recording, and advanced routing capabilities.',
        gradient: 'from-orange-500 to-red-500'
      },
      {
        icon: Video,
        title: 'Video Conferencing',
        description: 'Professional video meetings with screen sharing, recording, and virtual backgrounds.',
        gradient: 'from-indigo-500 to-purple-500'
      },
      {
        icon: Bell,
        title: 'Voice Notifications',
        description: 'Automated voice calls for alerts, reminders, and important announcements.',
        gradient: 'from-teal-500 to-blue-500'
      }
    ],
    developer: [
      {
        icon: Code,
        title: 'Powerful APIs',
        description: 'RESTful APIs and SDKs for all major programming languages with comprehensive documentation.',
        gradient: 'from-pink-500 to-rose-500'
      },
      {
        icon: Database,
        title: 'Data Analytics',
        description: 'Real-time analytics and insights to optimize your communication strategies.',
        gradient: 'from-cyan-500 to-blue-500'
      },
      {
        icon: Cloud,
        title: 'Cloud Infrastructure',
        description: 'Scalable, secure, and reliable cloud infrastructure with 99.9% uptime SLA.',
        gradient: 'from-purple-500 to-indigo-500'
      }
    ]
  }

  const allFeatures = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant, end-to-end encryption, and advanced security features.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Ultra-low latency and real-time message delivery under 100ms.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Lock,
      title: 'GDPR Compliant',
      description: 'Full compliance with data protection regulations worldwide.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile SDK',
      description: 'Native iOS and Android SDKs for seamless mobile integration.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Mail,
      title: 'Email Integration',
      description: 'Professional email services with templates and automation.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: BarChart,
      title: 'Advanced Analytics',
      description: 'Detailed metrics, custom reports, and AI-powered insights.',
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-900 to-purple-900/20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            <span className="text-white">to Connect</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Powerful features designed to scale with your business and delight your customers.
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
            {['messaging', 'voice', 'developer'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features[activeTab as keyof typeof features].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            >
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* All Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            More Powerful Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.05 * index }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 shadow-2xl">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Communication?
              </h3>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of companies already using our platform to deliver exceptional customer experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-100 rounded-xl">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm">
                  Book a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection