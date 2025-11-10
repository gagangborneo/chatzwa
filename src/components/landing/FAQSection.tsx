'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Zap,
  Shield,
  Users,
  Globe,
  Clock,
  BarChart3,
  HelpCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { t } = useLanguage()

  const faqs = [
    {
      question: "Apa itu chatzku?",
      answer: "chatzku adalah platform CPaaS (Communications Platform as a Service) yang menyediakan solusi chatbot AI untuk WhatsApp. Kami membantu bisnis mengotomasi layanan pelanggan dengan AI yang cerdas dan responsif.",
      icon: MessageCircle
    },
    {
      question: "Bagaimana cara kerja chatbot AI?",
      answer: "Chatbot AI kami menggunakan Natural Language Processing untuk memahami dan merespons pesan pelanggan secara otomatis. Sistem dapat belajar dari interaksi sebelumnya untuk memberikan respons yang lebih baik.",
      icon: Zap
    },
    {
      question: "Apakah chatzku aman untuk data bisnis?",
      answer: "Ya, kami menggunakan enkripsi end-to-end dan keamanan enterprise-grade untuk melindungi data bisnis Anda. Semua percakapan tersimpan dengan aman dan mematuhi standar keamanan internasional.",
      icon: Shield
    },
    {
      question: "Berapa biaya untuk menggunakan chatzku?",
      answer: "Kami menawarkan beberapa paket harga mulai dari Rp 499.000/bulan untuk Starter, Rp 1.499.000/bulan untuk Professional, dan khusus untuk Enterprise. Ada pilihan pembayaran bulanan dan tahunan dengan diskon.",
      icon: BarChart3
    },
    {
      question: "Apakah ada uji coba gratis?",
      answer: "Ya, kami menyediakan uji coba gratis 14 hari untuk semua paket. Anda dapat mencoba fitur lengkap tanpa perlu kartu kredit selama periode uji coba.",
      icon: Clock
    },
    {
      question: "Bagaimana integrasi dengan sistem yang sudah ada?",
      answer: "chatzku mudah diintegrasikan dengan sistem CRM, website, dan aplikasi yang sudah Anda gunakan melalui API yang komprehensif. Tim kami juga membantu proses integrasi jika diperlukan.",
      icon: Globe
    },
    {
      question: "Apakah support tersedia dalam Bahasa Indonesia?",
      answer: "Tentu saja! Kami menyediakan support penuh dalam Bahasa Indonesia melalui email, chat, dan telepon. Tim support lokal kami siap membantu Anda 24/7.",
      icon: Users
    },
    {
      question: "Bagaimana cara memulai menggunakan chatzku?",
      answer: "Anda bisa mulai dengan mendaftar akun gratis, konfigurasi chatbot sesuai kebutuhan bisnis Anda, dan integrasikan dengan WhatsApp dalam hitungan menit. Tidak memerlukan pengetahuan teknis yang mendalam.",
      icon: HelpCircle
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Pertanyaan yang Sering Diajukan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang chatzku dan layanan kami
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <CardContent className="p-6">
                  {/* Question */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <faq.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 pr-2">
                          {faq.question}
                        </h3>
                        <div className="text-gray-400 ml-2">
                          {openIndex === index ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {openIndex === index && (
                    <div className="mt-4 pl-14">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Masih Ada Pertanyaan?
              </h3>
              <p className="text-xl text-green-100 mb-8">
                Tim support kami siap membantu Anda menjawab semua pertanyaan tentang chatzku
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300 text-center"
                >
                  Hubungi Kami
                </a>
                <a
                  href="/pricing"
                  className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors duration-300 text-center backdrop-blur-sm"
                >
                  Lihat Harga
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default FAQSection