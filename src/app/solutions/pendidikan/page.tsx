'use client'

import { useState } from 'react'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import {
  GraduationCap,
  BookOpen,
  Users,
  Clock,
  MessageCircle,
  Award,
  Brain,
  Calendar,
  CheckCircle,
  ArrowRight,
  Video,
  FileText,
  Headphones
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PendidikanSolution = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Learning 24/7',
      description: 'Siswa dapat belajar kapan saja dengan AI tutor yang selalu tersedia untuk menjawab pertanyaan'
    },
    {
      icon: Users,
      title: 'Personalized Learning',
      description: 'AI menyesuaikan gaya belajar dan kecepatan setiap siswa untuk hasil optimal'
    },
    {
      icon: Brain,
      title: 'Instant Feedback',
      description: 'Siswa mendapatkan feedback langsung pada tugas dan kuis untuk perbaikan segera'
    },
    {
      icon: Award,
      title: 'Engagement Boost',
      description: 'Interaksi yang menarik dan gamifikasi meningkatkan motivasi belajar siswa'
    }
  ]

  const useCases = [
    {
      category: 'Student Support',
      icon: GraduationCap,
      scenarios: [
        'Bantuan PR dan tugas sekolah',
        'Penjelasan konsep yang sulit dipahami',
        'Persiapan ujian dan kuis',
        'Rekomendasi materi belajar'
      ]
    },
    {
      category: 'Teacher Assistant',
      icon: BookOpen,
      scenarios: [
        'Grading otomatis untuk soal pilihan ganda',
        'Membuat quiz dan materi pembelajaran',
        'Tracking progress siswa',
        'Scheduling reminders dan deadlines'
      ]
    },
    {
      category: 'Parent Communication',
      icon: MessageCircle,
      scenarios: [
        'Update perkembangan siswa',
        'Jadwal kegiatan sekolah',
        'Informasi biaya dan pembayaran',
        'Koordinasi meeting dengan guru'
      ]
    }
  ]

  const stats = [
    {
      metric: '85%',
      label: 'Siswa lebih nyaman bertanya ke AI vs guru',
      icon: MessageCircle
    },
    {
      metric: '3x',
      label: 'Peningkatan engagement dalam pembelajaran',
      icon: Brain
    },
    {
      metric: '24/7',
      label: 'Availability untuk learning support',
      icon: Clock
    },
    {
      metric: '40%',
      label: 'Peningkatan test scores dengan AI tutoring',
      icon: Award
    }
  ]

  const features = [
    {
      title: 'AI Tutoring',
      description: 'Personal tutor AI yang membantu siswa memahami materi sulit dengan cara yang mudah dipahami',
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Interactive Learning',
      description: 'Quiz, games, dan aktivitas interaktif yang membuat pembelajaran menyenangkan',
      icon: Brain,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Progress Tracking',
      description: 'Dashboard lengkap untuk monitoring progress belajar siswa dan identifikasi area yang perlu diperbaiki',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Resource Library',
      description: 'Koleksi materi pembelajaran, video, dan referensi yang dapat diakses kapan saja',
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <GraduationCap className="w-4 h-4 mr-2" />
              Solusi Pendidikan
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Education
              <br />
              for Modern Learning
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Transformasi pengalaman belajar dengan AI tutor yang personal, interaktif,
              dan tersedia 24/7 untuk mendukung kesuksesan akademik siswa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl">
                  Demo Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products/ai-chatbot">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl">
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                Mengapa Pendidikan Perlu AI Assistant?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Setiap siswa memiliki kebutuhan belajar yang berbeda. AI memberikan perhatian personal
                dan support yang konsisten untuk membantu setiap siswa mencapai potensi maksimal mereka.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
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
                Fitur Lengkap untuk Pendidikan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Solusi AI comprehensif untuk mendukung siswa, guru, dan orang tua dalam ekosistem pendidikan
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
                Use Cases untuk Pendidikan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Berbagai skenario implementasi AI untuk meningkatkan kualitas pendidikan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Transform Pendidikan Anda?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan institusi pendidikan yang telah meningkatkan kualitas pembelajaran
              dan hasil akademik dengan AI education assistant dari Chatzwa
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl">
                  Mulai Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products/embed-chat">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl">
                  Integrasi Website
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

export default PendidikanSolution