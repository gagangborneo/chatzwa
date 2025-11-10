'use client'

import { useState } from 'react'
import {
  FileText,
  Shield,
  AlertTriangle,
  Users,
  CreditCard,
  Ban,
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Gavel,
  Scale,
  Eye,
  Lock,
  RefreshCw,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const TermsPage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const sections = [
    {
      id: 'penerimaan-syarat',
      title: 'Penerimaan Syarat & Ketentuan',
      icon: CheckCircle,
      content: [
        'Dengan mendaftar dan menggunakan layanan chatzku, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini',
        'Anda menyatakan bahwa Anda memiliki kapasitas hukum untuk mengikat diri dalam perjanjian ini',
        'Jika Anda menggunakan layanan atas nama entitas bisnis, Anda menyatakan memiliki wewenang untuk menerima syarat ini atas nama entitas tersebut',
        'Anda tidak boleh menggunakan layanan jika Anda dilarang atau tidak berwenang menerima syarat ini'
      ]
    },
    {
      id: 'deskripsi-layanan',
      title: 'Deskripsi Layanan',
      icon: FileText,
      content: [
        'chatzku adalah platform CPaaS (Communications Platform as a Service) yang menyediakan layanan chatbot AI dan komunikasi digital',
        'Layanan mencakupi WhatsApp Business API, AI chatbot, analytics dashboard, dan integrasi dengan sistem pihak ketiga',
        'Kami berhak untuk mengubah atau menghentikan layanan sewaktu-waktu dengan pemberitahuan terlebih dahulu',
        'Fitur layanan dapat bervariasi antar paket berlangganan yang berbeda'
      ]
    },
    {
      id: 'akun-pengguna',
      title: 'Akun Pengguna',
      icon: Users,
      content: [
        'Anda bertanggung jawab untuk menjaga kerahasiaan kredensial akun Anda',
        'Anda harus memberikan informasi yang akurat, lengkap, dan terkini saat mendaftar',
        'Anda dilarang membuat akun menggunakan identitas palsu atau milik orang lain',
        'Anda bertanggung jawab atas semua aktivitas yang terjadi di akun Anda',
        'Kami berhak untuk menangguhkan atau menonaktifkan akun yang melanggar syarat ini'
      ]
    },
    {
      id: 'penggunaan-yang-diperbolehkan',
      title: 'Penggunaan yang Diperbolehkan',
      icon: CheckCircle,
      content: [
        'Menggunakan layanan untuk komunikasi bisnis yang sah dan etis',
        'Integrasi layanan dengan aplikasi atau website yang Anda miliki atau izinkan',
        'Menggunakan data yang tersedia untuk analitik dan peningkatan layanan',
        'Menyesuaikan pengaturan chatbot sesuai dengan kebutuhan bisnis Anda',
        'Melaporkan bug atau masalah keamanan yang ditemukan'
      ]
    },
    {
      id: 'penggunaan-yang-dilarang',
      title: 'Penggunaan yang Dilarang',
      icon: Ban,
      content: [
        'Menggunakan layanan untuk aktivitas ilegal atau tidak sah',
        'Mengirim konten yang melanggar hak kekayaan intelektual',
        'Menggunakan layanan untuk penipuan, phishing, atau aktivitas penipuan lainnya',
        'Mengirim spam, pesan tidak diminta, atau konten yang berbahaya',
        'Mencoba mengakses sistem secara tidak sah atau memanipulasi layanan',
        'Menggunakan layanan untuk mengganggu atau merusak sistem pihak lain'
      ]
    },
    {
      id: 'kepemilikan-intelektual',
      title: 'Kepemilikan Intelektual',
      icon: Shield,
      content: [
        'Semua hak kekayaan intelektual layanan milik chatzku atau pemberi lisensi kami',
        'Anda tidak mendapatkan hak kepemilikan atas konten yang dihasilkan oleh AI',
        'Anda dilarang menggunakan merek, logo, atau hak kekayaan intelektual kami tanpa izin tertulis',
        'Kami memberikan Anda lisensi terbatas untuk menggunakan layanan sesuai syarat ini',
        'Konten yang Anda buat tetap menjadi milik Anda, namun Anda memberikan kami lisensi untuk menggunakannya dalam operasi layanan'
      ]
    },
    {
      id: 'privasi-data',
      title: 'Privasi dan Data',
      icon: Lock,
      content: [
        'Pengumpulan dan penggunaan data Anda tunduk pada Kebijakan Privasi kami',
        'Kami melindungi data Anda dengan enkripsi dan keamanan enterprise-grade',
        'Anda memiliki hak untuk mengakses, mengoreksi, atau menghapus data pribadi Anda',
        'Kami tidak akan menjual data pribadi Anda kepada pihak ketiga',
        'Anda setuju untuk tidak mengumpulkan data pengguna akhir tanpa persetujuan yang jelas'
      ]
    },
    {
      id: 'pembayaran',
      title: 'Pembayaran dan Penagihan',
      icon: CreditCard,
      content: [
        'Biaya berlangganan ditagih secara bulanan atau tahunan sesuai paket yang dipilih',
        'Semua pembayaran dilakukan dalam mata uang Rupiah (IDR)',
        'Kami menerima berbagai metode pembayaran termasuk transfer bank dan e-wallet',
        'Pembayaran harus dilakukan tepat waktu untuk menghindari penangguhan layanan',
        'Harga dapat berubah dengan pemberitahuan 30 hari sebelumnya',
        'Tidak ada pengembalian dana untuk penggunaan layanan yang sudah terjadi'
      ]
    },
    {
      id: 'terminasi',
      title: 'Terminasi dan Suspensi',
      icon: AlertTriangle,
      content: [
        'Anda dapat mengakhiri langganan kapan saja dengan pemberitahuan 30 hari',
        'Kami dapat menangguhkan atau mengakhiri akun jika melanggar syarat ini',
        'Data Anda akan dihapus dalam 30 hari setelah terminasi, kecuali diwajibkan oleh hukum',
        'Anda tetap bertanggung jawab atas semua biaya yang terakumulasi sebelum terminasi',
        'Hak akses ke layanan akan berakhir segera setelah terminasi'
      ]
    },
    {
      id: 'penyangkalan',
      title: 'PENYANGKALAN',
      icon: AlertCircle,
      content: [
        'LAYANAN DISEDIAKAN "SEBAGAIMANA ADANYA" TANPA JAMINAN APA PUN',
        'Kami tidak menjamin layanan akan bebas dari gangguan atau error',
        'Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan',
        'Kami tidak menjamin akurasi atau kualitas respons AI chatbot',
        'Kami tidak bertanggung jawab atas konten yang dihasilkan oleh AI',
        'Penggunaan layanan sepenuhnya menjadi risiko Anda'
      ]
    },
    {
      id: 'batasan-tanggung-jawab',
      title: 'Batasan Tanggung Jawab',
      icon: Scale,
      content: [
        'Tanggung jawab kami dibatasi sebesar biaya langganan yang dibayar dalam 3 bulan terakhir',
        'Kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, konsekuensial, atau hukuman',
        'Kami tidak bertanggung jawab atas kehilangan data atau keuntungan bisnis',
        'Beberapa yurisdiksi tidak mengizinkan penyangkalan atau pembatasan tanggung jawab',
        'Jika Anda tidak setuju dengan batasan ini, jangan gunakan layanan kami'
      ]
    }
  ]

  const violationExamples = [
    { category: 'Ilegal', examples: ['Penipuan online', 'Pencucian uang', 'Penjualan barang ilegal'] },
    { category: 'Security', examples: ['Hacking', 'DDoS attacks', 'Malware distribution'] },
    { category: 'Content', examples: ['Hate speech', 'Kekerasan', 'Pornografi', 'Pembajakan'] },
    { category: 'Privacy', examples: ['Phishing', 'Data harvesting', 'Stalking'] }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Syarat & Ketentuan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Syarat dan ketentuan ini mengatur penggunaan layanan chatzku.
              Dengan menggunakan layanan kami, Anda setuju untuk mematuhi semua syarat yang tercantum di bawah.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Versi 2.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Terakhir diperbarui: 13 Oktober 2024</span>
              </div>
              <Badge variant="outline" className="border-orange-500 text-orange-600">
                Penting: Baca dengan Seksama
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-l-4 border-red-500 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-bold text-red-900 mb-2">PENTING: BACA DENGAN SEKSAMA</h3>
                    <p className="text-red-700 leading-relaxed">
                      Syarat dan ketentuan ini mengikat secara hukum. Dengan mendaftar dan menggunakan layanan chatzku,
                      Anda mengakui telah membaca, memahami, dan menyetujui untuk terikat oleh syarat ini.
                      Jika Anda tidak menyetujui syarat ini, jangan menggunakan layanan kami.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Quick Summary */}
          <Card className="mb-16 border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Ringkasan Syarat Utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Usaha Sah</h4>
                    <p className="text-sm text-gray-700">Hanya untuk kegiatan bisnis yang sah dan etis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Privasi Terlindungi</h4>
                    <p className="text-sm text-gray-700">Data pribadi Anda aman dan terenkripsi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Tanggung Jawab Terbatas</h4>
                    <p className="text-sm text-gray-700">Batasan tanggung jawab berlaku</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Penggunaan Etis</h4>
                    <p className="text-sm text-gray-700">Dilarang untuk kegiatan ilegal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={section.id} className="border border-gray-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    {expandedSection === section.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {expandedSection === section.id && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <ul className="space-y-3">
                        {section.content.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Violation Examples */}
          <Card className="mt-16 border-l-4 border-red-500">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contoh Pelanggaran yang Dilarang</h3>
              <p className="text-gray-700 mb-6">
                Berikut adalah contoh aktivitas yang secara tegas dilarang dan dapat mengakibatkan
                penangguhan atau terminasi akun:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {violationExamples.map((category, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-3">{category.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.examples.map((example, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consequences */}
          <Card className="mt-16 bg-orange-50 border-orange-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Konsekuensi Pelanggaran</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Peringatan</h4>
                      <p className="text-sm text-gray-700">Peringatan tertulis untuk pelanggaran pertama</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Suspensi Sementara</h4>
                      <p className="text-sm text-gray-700">Penangguhan akses ke fitur tertentu</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Terminasi Akun</h4>
                      <p className="text-sm text-gray-700">Penghentian layanan tanpa pengembalian</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gavel className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Tindakan Hukum</h4>
                      <p className="text-sm text-gray-700">Untuk pelanggaran serius atau ilegal</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan tentang Syarat & Ketentuan?</h3>
              <p className="text-gray-700 mb-6">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan kami,
                atau membutuhkan klarifikasi lebih lanjut, silakan hubungi tim legal kami.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Legal</p>
                    <p className="text-sm text-gray-700">legal@chatzku.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Telepon</p>
                    <p className="text-sm text-gray-700">+62 21 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Jam Operasional</p>
                    <p className="text-sm text-gray-700">Senin - Jumat, 09:00 - 18:00 WIB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-16 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-4">
              Syarat & Ketentuan ini berlaku efektif sejak 13 Oktober 2024.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Terakhir diperbarui: 13 Oktober 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>Versi 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default TermsPage