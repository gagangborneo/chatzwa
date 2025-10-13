'use client'

import { useState } from 'react'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import {
  Heart,
  Users,
  Clock,
  MessageCircle,
  Shield,
  Calendar,
  Pill,
  Activity,
  CheckCircle,
  ArrowRight,
  Stethoscope,
  FileText,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const KesehatanSolution = () => {
  const benefits = [
    {
      icon: Clock,
      title: '24/7 Health Support',
      description: 'Pasien dapat mendapatkan informasi kesehatan kapan saja, bahkan di luar jam praktik dokter'
    },
    {
      icon: Shield,
      title: 'Triage Awal yang Akurat',
      description: 'AI membantu mengidentifikasi tingkat urgensi keluhan pasien untuk penanganan yang tepat'
    },
    {
      icon: Users,
      title: 'Reduced Wait Times',
      description: 'Pasien mendapatkan jawaban cepat tanpa perlu menunggu antrian telepon atau chat'
    },
    {
      icon: Heart,
      title: 'Patient Engagement',
      description: 'Meningkatkan engagement pasien dengan reminder pengobatan dan tips kesehatan personal'
    }
  ]

  const useCases = [
    {
      category: 'Patient Triage',
      icon: Stethoscope,
      scenarios: [
        'Screening awal gejala penyakit',
        'Identifikasi emergency cases',
        'Rekomendasi tindakan selanjutnya',
        'Information tentang kondisi kesehatan'
      ]
    },
    {
      category: 'Appointment Management',
      icon: Calendar,
      scenarios: [
        'Booking appointment dengan dokter',
        'Reminder jadwal kontrol',
        'Reschedule dan cancel appointment',
        'Informasi persiapan kunjungan'
      ]
    },
    {
      category: 'Medication Support',
      icon: Pill,
      scenarios: [
        'Reminder minum obat tepat waktu',
        'Informasi efek samping obat',
        'Interaksi obat yang aman',
        'Refill reminders'
      ]
    }
  ]

  const stats = [
    {
      metric: '70%',
      label: 'Pasien lebih memilih chat untuk pertanyaan kesehatan',
      icon: MessageCircle
    },
    {
      metric: '40%',
      label: 'Pengurangan unnecessary ER visits',
      icon: Shield
    },
    {
      metric: '24/7',
      label: 'Availability untuk health inquiries',
      icon: Clock
    },
    {
      metric: '3x',
      label: 'Peningkatan medication compliance',
      icon: Pill
    }
  ]

  const features = [
    {
      title: 'Symptom Checker',
      description: 'AI-powered symptom analysis yang membantu pasien memahami kondisi kesehatan mereka',
      icon: Stethoscope,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Appointment Scheduling',
      description: 'Sistem booking otomatis yang terintegrasi dengan jadwal dokter dan rumah sakit',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Medication Reminders',
      description: 'Smart reminder system untuk memastikan pasien minum obat tepat waktu',
      icon: Pill,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Health Education',
      description: 'Informasi kesehatan yang reliable dan mudah dipahami untuk edukasi pasien',
      icon: Heart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-pink-600 to-rose-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Heart className="w-4 h-4 mr-2" />
              Solusi Kesehatan
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Healthcare
              <br />
              Patient Support
            </h1>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Transformasi layanan kesehatan dengan AI assistant yang membantu pasien
              mendapatkan informasi, booking appointment, dan support 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl">
                  Demo Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products/ai-chatbot">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl">
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
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
                Mengapa Healthcare Perlu AI Assistant?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Pasien modern mengharapkan akses cepat ke informasi kesehatan. AI assistant memberikan
                support yang instant dan reliable sambil mengoptimalkan sumber daya medis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
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
                Fitur Lengkap untuk Kesehatan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Solusi AI yang dirancang khusus untuk kebutuhan layanan kesehatan modern
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
                Use Cases untuk Kesehatan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Berbagai skenario implementasi AI untuk meningkatkan layanan kesehatan pasien
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Transform Layanan Kesehatan Anda?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan rumah sakit dan klinik yang telah meningkatkan patient experience
              dan operational efficiency dengan AI healthcare assistant dari 7connect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl">
                  Mulai Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products/whatsapp">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl">
                  Integrasi WhatsApp
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

export default KesehatanSolution