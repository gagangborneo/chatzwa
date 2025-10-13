'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  MessageCircle,
  Zap,
  Shield,
  ArrowRight,
  Play,
  CheckCircle,
  Globe,
  Users,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { icon: MessageCircle, text: 'Multi-Channel Communication' },
    { icon: Zap, text: 'Real-time Messaging' },
    { icon: Shield, text: 'Enterprise Security' },
    { icon: Globe, text: 'Global Scale' }
  ]

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute opacity-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
            width: '800px',
            height: '800px',
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"
      />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-purple-200 bg-purple-800/30 rounded-full border border-purple-700/50 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4" />
            <span>Next-Generation CPaaS Platform</span>
            <span className="px-2 py-0.5 text-xs bg-purple-600 rounded-full">NEW</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Connect & Engage
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              at Global Scale
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Transform your business communication with our powerful CPaaS platform.
            Integrate messaging, voice, video, and AI into your applications with ease.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-full border border-white/20 backdrop-blur-sm"
              >
                <feature.icon className="w-4 h-4 text-purple-300" />
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-white mb-2">
                <Users className="w-8 h-8 text-purple-400" />
                <span>10M+</span>
              </div>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-white mb-2">
                <Globe className="w-8 h-8 text-blue-400" />
                <span>150+</span>
              </div>
              <p className="text-gray-400">Countries</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-white mb-2">
                <BarChart3 className="w-8 h-8 text-green-400" />
                <span>99.9%</span>
              </div>
              <p className="text-gray-400">Uptime</p>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 pt-12 border-t border-white/10"
        >
          <p className="text-center text-gray-400 mb-8 text-sm">Trusted by leading companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['Enterprise', 'Startups', 'Developers', 'Agencies'].map((item, index) => (
              <div key={index} className="text-white font-semibold text-lg">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  )
}

export default HeroSection