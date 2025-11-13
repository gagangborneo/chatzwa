'use client'

import { useState } from 'react'
import {
  Shield,
  Eye,
  Database,
  Lock,
  Users,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const PrivacyPolicyPage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const sections = [
    {
      id: 'pengumpulan-data',
      title: 'Pengumpulan Data',
      icon: Database,
      content: [
        'Data yang Anda berikan secara langsung saat mendaftar atau menggunakan layanan kami',
        'Data yang dikumpulkan secara otomatis melalui penggunaan layanan',
        'Data dari pihak ketiga yang terkait dengan integrasi layanan',
        'Data analytics dan penggunaan untuk peningkatan layanan'
      ]
    },
    {
      id: 'penggunaan-data',
      title: 'Penggunaan Data',
      icon: Globe,
      content: [
        'Menyediakan dan mengoperasikan layanan Chatzwa',
        'Memproses transaksi dan komunikasi pelanggan',
        'Mengirim informasi penting terkait layanan',
        'Menganalisis dan meningkatkan kualitas layanan',
        'Melindungi keamanan dan mencegah penyalahgunaan'
      ]
    },
    {
      id: 'penyimpanan-keamanan',
      title: 'Penyimpanan dan Keamanan Data',
      icon: Lock,
      content: [
        'Enkripsi end-to-end untuk semua data transmisi',
        'Server yang aman dengan monitoring 24/7',
        'Akses terbatas untuk authorized personnel',
        'Backup data rutin dan disaster recovery',
        'Compliance dengan standar keamanan internasional'
      ]
    },
    {
      id: 'hak-anda',
      title: 'Hak Anda Sebagai Pengguna',
      icon: Users,
      content: [
        'Hak untuk mengakses data pribadi Anda',
        'Hak untuk memperbarui atau mengoreksi data',
        'Hak untuk menghapus data pribadi Anda',
        'Hak untuk menolak pemrosesan data tertentu',
        'Hak untuk portabilitas data ke layanan lain'
      ]
    },
    {
      id: 'cookies',
      title: 'Kebijakan Cookie',
      icon: FileText,
      content: [
        'Essential cookies untuk operasi dasar website',
        'Analytics cookies untuk memahami penggunaan',
        'Functional cookies untuk pengalaman yang dipersonalisasi',
        'Opsi untuk mengelola preferensi cookie',
        'Informasi transparan tentang penggunaan cookie'
      ]
    },
    {
      id: 'pihak-ketiga',
      title: 'Berbagi dengan Pihak Ketiga',
      icon: Globe,
      content: [
        'Penyedia layanan infrastruktur yang terverifikasi',
        'Partner integrasi dengan persetujuan eksplisit',
        'Otoritas hukum sesuai ketentuan peraturan',
        'Tidak ada penjualan data kepada pihak ketiga',
        'Kontrol penuh atas data yang dibagikan'
      ]
    }
  ]

  const dataCategories = [
    {
      name: 'Data Pribadi',
      examples: ['Nama lengkap', 'Email', 'Nomor telepon', 'Alamat', 'Tanggal lahir'],
      purpose: 'Identifikasi akun dan komunikasi'
    },
    {
      name: 'Data Penggunaan',
      examples: ['Log aktivitas', 'Preferensi chatbot', 'Riwayat percakapan', 'Data analytics'],
      purpose: 'Penyediaan layanan dan analitik'
    },
    {
      name: 'Data Teknis',
      examples: ['IP Address', 'Browser info', 'Device ID', 'Session data'],
      purpose: 'Keamanan dan troubleshooting'
    },
    {
      name: 'Data Finansial',
      examples: ['Informasi pembayaran', 'Invoice', 'Riwayat transaksi'],
      purpose: 'Proses billing dan keuangan'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Kebijakan Privasi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Perlindungan data Anda adalah prioritas utama kami. Kebijakan ini menjelaskan
              bagaimana Chatzwa mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Terakhir diperbarui: 13 Oktober 2024</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>Versi 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Introduction */}
          <Card className="mb-12 border-l-4 border-green-500">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Komitmen Privasi Kami</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Di Chatzwa, kami berkomitmen untuk melindungi privasi dan keamanan data pribadi Anda.
                Kebijakan privasi ini berlaku untuk semua pengguna layanan kami dan menjelaskan praktik
                privasi kami yang transparan dan dapat dipertanggungjawabkan.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Dengan menggunakan layanan Chatzwa, Anda menyetujui pengumpulan dan penggunaan data
                sebagaimana dijelaskan dalam kebijakan ini.
              </p>
            </CardContent>
          </Card>

          {/* Data Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Kategori Data yang Kami Kumpulkan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dataCategories.map((category, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Contoh data:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.examples.map((example, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tujuan:</p>
                      <p className="text-sm text-gray-700 mt-1">{category.purpose}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
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
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
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

          {/* Rights Summary */}
          <Card className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan Hak Privasi Anda</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Akses Data</h4>
                      <p className="text-sm text-gray-700">Minta salinan data pribadi Anda kapan saja</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Koreksi Data</h4>
                      <p className="text-sm text-gray-700">Perbarui informasi yang tidak akurat</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Hapus Data</h4>
                      <p className="text-sm text-gray-700">Minta penghapusan data pribadi Anda</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Batasi Pemrosesan</h4>
                      <p className="text-sm text-gray-700">Tolak atau batasi pemrosesan data tertentu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Portabilitas Data</h4>
                      <p className="text-sm text-gray-700">Pindahkan data ke layanan lain</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Informasi Jelas</h4>
                      <p className="text-sm text-gray-700">Tahu bagaimana data digunakan</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="mt-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan tentang Privasi?</h3>
              <p className="text-gray-700 mb-6">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi kami atau ingin
                menjalankan hak privasi Anda, jangan ragu untuk menghubungi kami.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-700">privacy@Chatzwa.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Telepon</p>
                    <p className="text-sm text-gray-700">+62 21 1234 5678</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Alamat</p>
                    <p className="text-sm text-gray-700">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-16 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600">
              Kebijakan Privasi ini berlaku efektif sejak 13 Oktober 2024.
              Kami dapat memperbarui kebijakan ini dari waktu ke waktu dan akan memberitahukan
              perubahan penting melalui email atau notifikasi di layanan kami.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PrivacyPolicyPage