'use client'

import { useState } from 'react'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import {
  Search,
  HelpCircle,
  MessageCircle,
  Users,
  Settings,
  Shield,
  CreditCard,
  Smartphone,
  FileText,
  ChevronDown,
  ChevronRight,
  Headphones,
  Mail,
  Phone,
  ExternalLink,
  BookOpen,
  Video,
  Download,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const HelpCenterPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Memulai',
      icon: Zap,
      description: 'Panduan awal untuk memulai menggunakan 7connect',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      faqs: [
        {
          question: 'Bagaimana cara mendaftar akun 7connect?',
          answer: 'Mendaftar akun 7connect sangat mudah. Kunjungi halaman pendaftaran, isi formulir dengan email dan password Anda, verifikasi email, dan Anda bisa langsung mulai menggunakan layanan kami.'
        },
        {
          question: 'Apa saja yang saya butuhkan untuk memulai?',
          answer: 'Anda hanya membutuhkan email aktif dan perangkat dengan koneksi internet. Tidak ada instalasi software atau hardware khusus yang diperlukan untuk memulai.'
        },
        {
          question: 'Apakah ada uji coba gratis?',
          answer: 'Ya, kami menyediakan uji coba gratis 14 hari dengan fitur lengkap. Tidak perlu kartu kredit untuk mendaftar uji coba gratis.'
        },
        {
          question: 'Bagaimana cara upgrade ke paket berbayar?',
          answer: 'Anda bisa upgrade kapan saja melalui dashboard akun. Pilih paket yang sesuai kebutuhan bisnis Anda dan ikuti langkah pembayaran yang aman.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Produk & Fitur',
      icon: Smartphone,
      description: 'Informasi lengkap tentang produk dan fitur 7connect',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      faqs: [
        {
          question: 'Apa perbedaan antara AI Chatbot dan WhatsApp Business?',
          answer: 'AI Chatbot adalah sistem otomatisasi percakapan, sedangkan WhatsApp Business adalah platform komunikasi. Keduanya dapat digabungkan untuk customer service yang optimal.'
        },
        {
          question: 'Apakah 7connect bisa terintegrasi dengan sistem yang sudah ada?',
          answer: 'Ya, 7connect memiliki API yang lengkap untuk integrasi dengan CRM, e-commerce platform, dan sistem bisnis lainnya.'
        },
        {
          question: 'Bagaimana cara install WordPress Plugin?',
          answer: 'Download plugin dari dashboard, upload ke WordPress admin, activate plugin, masukkan API key Anda, dan plugin siap digunakan.'
        },
        {
          question: 'Apa itu Embed Chat?',
          answer: 'Embed Chat adalah widget yang bisa ditambahkan ke website Anda untuk visitor chat. Instalasi hanya membutuhkan satu baris kode JavaScript.'
        }
      ]
    },
    {
      id: 'billing',
      title: 'Tagihan & Pembayaran',
      icon: CreditCard,
      description: 'Informasi tentang harga, pembayaran, dan tagihan',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      faqs: [
        {
          question: 'Metode pembayaran apa saja yang diterima?',
          answer: 'Kami menerima transfer bank, kartu kredit/debit, dan e-wallet (OVO, GoPay, Dana). Semua transaksi diproses dengan aman.'
        },
        {
          question: 'Apakah saya bisa berhenti berlangganan kapan saja?',
          answer: 'Ya, Anda bisa berhenti berlangganan kapan saja tanpa penalti. Akses Anda akan tetap aktif hingga akhir periode berlangganan.'
        },
        {
          question: 'Bagaimana sistem perhitungan penggunaan?',
          answer: 'Penggunaan dihitung berdasarkan jumlah chat conversations, API calls, dan penggunaan fitur lainnya sesuai dengan paket Anda.'
        },
        {
          question: 'Apakah ada refund guarantee?',
          answer: 'Kami menyediakan 30-day money back guarantee untuk paket berbayar jika Anda tidak puas dengan layanan kami.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Bantuan Teknis',
      icon: Settings,
      description: 'Solusi untuk masalah teknis dan troubleshooting',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      faqs: [
        {
          question: 'Bagaimana jika chatbot tidak merespons?',
          answer: 'Periksa koneksi internet, refresh halaman, atau hubungi support team kami via live chat untuk bantuan lebih lanjut.'
        },
        {
          question: 'Apakah data pelanggan aman?',
          answer: 'Ya, semua data dienkripsi dengan SSL/TLS dan disimpan di server yang aman. Kami mematuhi standar keamanan internasional.'
        },
        {
          question: 'Berapa lama waktu respon API?',
          answer: 'API response time rata-rata kurang dari 200ms untuk optimal performance. Monitor real-time di dashboard Anda.'
        },
        {
          question: 'Bagaimana cara backup data?',
          answer: 'Data Anda otomatis backup setiap hari. Anda juga bisa export data kapan saja melalui dashboard dalam format CSV atau JSON.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Akun & Keamanan',
      icon: Shield,
      description: 'Pengelolaan akun dan keamanan data',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      faqs: [
        {
          question: 'Bagaimana cara reset password?',
          answer: 'Klik "Lupa Password" di halaman login, masukkan email Anda, dan ikuti instruksi reset password yang dikirim ke email.'
        },
        {
          question: 'Bisakah saya mengubah email akun?',
          answer: 'Ya, Anda bisa mengubah email akun melalui settings di dashboard. Email baru akan perlu diverifikasi.'
        },
        {
          question: 'Apakah mendukung multi-user access?',
          answer: 'Ya, paket Enterprise mendukung multi-user dengan role-based access control dan team management.'
        },
        {
          question: 'Bagaimana cara menghapus akun?',
          answer: 'Anda bisa request penghapusan akun melalui settings atau hubungi support. Data akan dihapus permanen dalam 30 hari.'
        }
      ]
    }
  ]

  const quickLinks = [
    { title: 'Video Tutorial', href: '#', icon: Video, description: 'Panduan video langkah demi langkah' },
    { title: 'Documentation', href: '#', icon: FileText, description: 'Dokumentasi teknis lengkap' },
    { title: 'API Reference', href: '#', icon: Settings, description: 'Referensi API untuk developer' },
    { title: 'Downloads', href: '#', icon: Download, description: 'Download plugin dan resources' }
  ]

  const contactOptions = [
    {
      icon: Headphones,
      title: 'Live Chat Support',
      description: 'Chat dengan tim support kami',
      action: 'Mulai Chat',
      href: '#',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@7connect.id',
      action: 'Kirim Email',
      href: 'mailto:support@7connect.id',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+62 21 1234 5678',
      action: 'Hubungi Kami',
      href: 'tel:+622112345678',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category =>
    searchTerm === '' || category.faqs.length > 0
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ada yang bisa
              <br />
              Kami Bantu?
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Temukan jawaban, panduan, dan bantuan untuk semua produk dan layanan 7connect
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari bantuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resource Cepat</h2>
            <p className="text-gray-600">Akses cepat ke panduan dan dokumentasi</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group"
              >
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                    <div className="flex items-center justify-center text-green-600 text-sm font-medium">
                      <span>Akses</span>
                      <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Pertanyaan yang sering diajukan tentang 7connect</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="border-gray-200 mb-6 overflow-hidden">
                <CardHeader
                  className={`cursor-pointer hover:bg-gray-50 transition-colors ${category.bgColor}`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                        <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gray-300">
                        {category.faqs.length} FAQ
                      </Badge>
                      {expandedCategories.includes(category.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedCategories.includes(category.id) && (
                  <CardContent className="pt-0">
                    <div className="border-t border-gray-200">
                      {category.faqs.map((faq, faqIndex) => (
                        <div key={faqIndex} className="py-6 border-b border-gray-100 last:border-b-0">
                          <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada jawaban ditemukan</h3>
                <p className="text-gray-600">Coba kata kunci lain atau hubungi support kami</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Masih Perlu Bantuan?</h2>
            <p className="text-gray-600">Tim support kami siap membantu Anda 24/7</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactOptions.map((option, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${option.bgColor} rounded-lg flex items-center justify-center mx-auto mb-6`}>
                    <option.icon className={`w-8 h-8 ${option.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>
                  <Link href={option.href}>
                    <Button className="w-full hover:shadow-lg transition-all duration-300">
                      {option.action}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HelpCenterPage