'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import {
  MessageCircle,
  Headphones,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Heart,
  Zap,
  Shield,
  BarChart3,
  Users,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const SolutionsPage = () => {
  const { t } = useLanguage()

  const solutions = [
    {
      title: 'Customer Service',
      subtitle: 'Layanan Pelanggan Otomatis',
      description: 'Chatbot AI 24/7 untuk merespons pertanyaan pelanggan, mengurangi beban tim support, dan meningkatkan kepuasan pelanggan.',
      icon: Headphones,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Respon otomatis 24/7',
        'Multi-bahasa',
        'Integrasi CRM',
        'Analitik percakapan',
        'Handover ke agent',
        'Personalisasi respons'
      ],
      stats: [
        { label: 'Respon Rata-rata', value: '< 2 detik' },
        { label: 'Pengurangan Biaya', value: 'Hingga 60%' },
        { label: 'Kepuasan Pelanggan', value: '95%' }
      ]
    },
    {
      title: 'Informasi Produk',
      subtitle: 'Asisten Pembelian Cerdas',
      description: 'Bantu pelanggan menemukan produk yang tepat, berikan rekomendasi personal, dan jawab pertanyaan tentang produk secara real-time.',
      icon: ShoppingBag,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Rekomendasi produk',
        'Katalog interaktif',
        'Pembanding harga',
        'Stok real-time',
        'Tracking pesanan',
        'Review produk'
      ],
      stats: [
        { label: 'Konversi', value: '+35%' },
        { label: 'Ukuran Keranjang', value: '+25%' },
        { label: 'Retensi Pelanggan', value: '+40%' }
      ]
    },
    {
      title: 'Pendidikan',
      subtitle: 'Platform Pembelajaran Digital',
      description: 'Tutor AI untuk mendukung proses belajar mengajar, menjawab pertanyaan siswa, dan memberikan materi pembelajaran interaktif.',
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-500',
      features: [
        'Tutor personal AI',
        'Latihan adaptif',
        'Tracking progress',
        'Quiz interaktif',
        'Materi multimedia',
        'Sertifikat digital'
      ],
      stats: [
        { label: 'Engagement Siswa', value: '+70%' },
        { label: 'Pemahaman Materi', value: '+50%' },
        { label: 'Waktu Belajar', value: '+45%' }
      ]
    },
    {
      title: 'Kesehatan',
      subtitle: 'Asisten Medis Virtual',
      description: 'Bantu pasien dengan jadwal janji temu, pengingat obat, dan informasi kesehatan dasar dengan privasi terjamin.',
      icon: Heart,
      color: 'from-red-500 to-orange-500',
      features: [
        'Jadwal janji temu',
        'Pengingat obat',
        'Screening awal',
        'Edukasi kesehatan',
        'Telemedicine',
        'HIPAA compliant'
      ],
      stats: [
        { label: 'Kehadiran Pasien', value: '+90%' },
        { label: 'Kepatuhan Obat', value: '+80%' },
        { label: 'Waktu Tunggu', value: '-75%' }
      ]
    },
    {
      title: 'Finance',
      subtitle: 'Asisten Keuangan Pintar',
      description: 'Bantu nasabah dengan informasi saldo, transfer, dan konsultasi keuangan dasar melalui chat yang aman.',
      icon: Briefcase,
      color: 'from-indigo-500 to-blue-500',
      features: [
        'Info saldo real-time',
        'Transfer uang',
        'Investasi dasar',
        'Budget tracking',
        'Notifikasi transaksi',
        'Fraud detection'
      ],
      stats: [
        { label: 'Transaksi/Hari', value: '10K+' },
        { label: 'Satisfaction Rate', value: '92%' },
        { label: 'Security Score', value: '99.9%' }
      ]
    },
    {
      title: 'Layanan Publik',
      subtitle: 'Pemerintahan Digital',
      description: 'Permudah akses layanan publik, informasi regulasi, dan pengaduan masyarakat melalui chatbot pemerintah.',
      icon: Globe,
      color: 'from-teal-500 to-cyan-500',
      features: [
        'Informasi layanan',
        'Pengaduan online',
        'Tracking permohonan',
        'Informasi regulasi',
        'Survey publik',
        'Multi bahasa'
      ],
      stats: [
        { label: 'Permohonan/Hari', value: '5K+' },
        { label: 'Waktu Respon', value: '< 1 jam' },
        { label: 'Satisfaction Rate', value: '88%' }
      ]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: 'Implementasi Cepat',
      description: 'Go live dalam hitungan hari, bukan bulan'
    },
    {
      icon: Shield,
      title: 'Keamanan Terjamin',
      description: 'Enkripsi end-to-end dan compliance internasional'
    },
    {
      icon: BarChart3,
      title: 'Analytics Real-time',
      description: 'Monitor performa dan dapatkan insight langsung'
    },
    {
      icon: Users,
      title: 'Support 24/7',
      description: 'Tim ahli kami siap membantu kapan saja'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Solusi Chatzwa
              </span>
              <br />
              <span className="text-gray-700">Untuk Setiap Industri</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Platform chatbot AI yang dapat disesuaikan untuk berbagai kebutuhan bisnis dan industri.
              Transformasikan cara Anda berinteraksi dengan pelanggan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  Konsultasi Gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-green-600 text-green-700 bg-white hover:bg-green-50 rounded-xl transition-all duration-300"
                >
                  Lihat Harga
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solusi untuk Setiap Kebutuhan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih solusi yang tepat untuk industri dan kebutuhan spesifik bisnis Anda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center`}>
                      <solution.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {solution.title}
                      </CardTitle>
                      <p className="text-gray-600">{solution.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {solution.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Fitur Utama:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                    {solution.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link href="/contact">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                        Pelajari Lebih Lanjut
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Chatzwa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platform yang kuat, aman, dan mudah digunakan untuk transformasi digital bisnis Anda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white border border-gray-200 shadow-sm text-center p-6">
                <CardContent className="p-0">
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.icon === Zap ? 'from-yellow-500 to-orange-500' : benefit.icon === Shield ? 'from-green-500 to-emerald-500' : benefit.icon === BarChart3 ? 'from-blue-500 to-indigo-500' : 'from-purple-500 to-pink-500'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Siap Transformasi Bisnis Anda?
              </h2>
              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan ratusan bisnis yang sudah menggunakan Chatzwa
                untuk meningkatkan efisiensi dan kepuasan pelanggan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="px-8 py-4 text-lg font-semibold bg-white text-green-600 hover:bg-gray-100 rounded-xl">
                    Mulai Konsultasi
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg font-semibold border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm">
                    Lihat Paket Harga
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SolutionsPage