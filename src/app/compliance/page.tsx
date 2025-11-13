'use client'

import { useState } from 'react'
import {
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Database,
  Lock,
  Globe,
  Users,
  Eye,
  Clock,
  ChevronDown,
  ChevronRight,
  Award,
  Scale,
  Gavel,
  RefreshCw,
  Building,
  UserCheck,
  Fingerprint
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'

const CompliancePage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const complianceFrameworks = [
    {
      name: 'SOC 2 Type II',
      description: 'Service Organization Control 2 Type II',
      status: 'certified',
      lastAudit: 'September 2024',
      nextAudit: 'September 2025',
      scope: 'Security, Availability, Processing Integrity, Confidentiality, Privacy',
      icon: Shield
    },
    {
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      status: 'compliant',
      lastAudit: 'August 2024',
      nextAudit: 'August 2025',
      scope: 'Data Protection & Privacy Rights',
      icon: Globe
    },
    {
      name: 'CCPA',
      description: 'California Consumer Privacy Act',
      status: 'compliant',
      lastAudit: 'August 2024',
      nextAudit: 'August 2025',
      scope: 'Consumer Privacy Rights',
      icon: Users
    },
    {
      name: 'PDPA',
      description: 'Personal Data Protection Act (Indonesia)',
      status: 'compliant',
      lastAudit: 'July 2024',
      nextAudit: 'July 2025',
      scope: 'Indonesian Data Protection',
      icon: Building
    }
  ]

  const sections = [
    {
      id: 'komitmen-keamanan',
      title: 'Komitmen Keamanan Data',
      icon: Shield,
      content: [
        'Chatzwa berkomitmen untuk melindungi data pelanggan kami dengan standar keamanan tertinggi',
        'Kami menggunakan enkripsi end-to-end untuk semua data yang dikirim dan disimpan',
        'Kami memiliki tim keamanan khusus yang memantau ancaman keamanan 24/7',
        'Kami melakukan audit keamanan rutin dengan pihak ketiga yang independen',
        'Kami memberikan pelatihan keamanan berkala kepada semua karyawan'
      ]
    },
    {
      id: 'implementasi-teknis',
      title: 'Implementasi Teknis Keamanan',
      icon: Lock,
      content: [
        'Enkripsi data saat transit menggunakan TLS 1.3 dan enkripsi data saat istirahat dengan AES-256',
        'Autentikasi multi-faktor untuk akses sistem admin',
        'Regular security patches dan vulnerability scanning',
        'Network segmentation dan firewall configuration',
        'Security monitoring dan incident response procedures',
        'Backup dan disaster recovery dengan geographically distributed servers'
      ]
    },
    {
      id: 'hak-privasi-pengguna',
      title: 'Hak Privasi Pengguna',
      icon: Users,
      content: [
        'Hak untuk mengetah data pribadi yang kami simpan tentang Anda',
        'Hak untuk memperbarui atau menghapus data pribadi yang tidak akurat',
        'Hak untuk membatasi pemrosesan data pribadi Anda',
        'Hak untuk menolak pemrosesan otomatis untuk pengambilan keputusan',
        'Hak untuk portabilitas data ke layanan lain',
        'Hak untuk mengajukan keluhan ke otoritas perlindungan data'
      ]
    },
    {
      id: 'audit-regular',
      title: 'Audit dan Penilaian Reguler',
      icon: FileText,
      content: [
        'Audit eksternal tahunan untuk SOC 2 compliance',
        'Penilaian vendor keamanan dan pihak ketiga',
        'Penilaian risiko keamanan dan kerentanan',
        'Penilaian compliance terhadap peraturan privasi yang berlaku',
        'Review regular keamanan implementasi teknis',
        'Pelatihan dan awareness program untuk semua staf'
      ]
    },
    {
      id: 'incident-response',
      title: 'Incident Response Plan',
      icon: AlertCircle,
      content: [
        'Prosedur identifikasi dan klasifikasi insiden keamanan',
        'Tim incident response yang tersedia 24/7',
        'Prosedur eskalasi untuk insiden serius',
        'Notifikasi kepada pengguna dan regulator sesuai ketentuan',
        'Post-incident analysis dan improvement actions',
        'Regular testing dan updating incident response procedures'
      ]
    },
    {
      id: 'vendor-management',
      title: 'Manajemen Pihak Ketiga',
      icon: Database,
      content: [
        'Due diligence menyeluruhkan semua vendor sebelum integrasi',
        'Kontrak kerja dengan klause keamanan dan privasi yang ketat',
        'Regular monitoring vendor compliance terhadap SLA',
        'Audit terhadap praktik keamanan vendor',
        'Prosedur off-boarding untuk menghapus akses vendor',
        'Documentation lengkap untuk semua integrasi pihak ketiga'
      ]
    },
    {
      id: 'training-awareness',
      title: 'Pelatihan dan Kesadaran',
      icon: UserCheck,
      content: [
        'Pelatihan wajib tahunan untuk semua karyawan tentang keamanan data',
        'Training khusus untuk tim teknis dan support',
        'Regular awareness campaigns tentang phishing dan social engineering',
        'Testing keamanan simulasi untuk meningkatkan kewaspadaan',
        'Documentation lengkap tentang kebijakan dan prosedur',
        'Regular updates tentang ancaman keamanan terkini'
      ]
    }
  ]

  const securityControls = [
    {
      category: 'Access Control',
      controls: [
        'Multi-factor authentication',
        'Role-based access control',
        'Least privilege principle',
        'Regular access reviews',
        'Session timeout policies'
      ]
    },
    {
      category: 'Data Protection',
      controls: [
        'Encryption at rest and in transit',
        'Data masking for development',
        'Data retention policies',
        'Secure data disposal',
        'Data classification framework'
      ]
    },
    {
      category: 'Network Security',
      controls: [
        'Firewall configuration',
        'Intrusion detection systems',
        'DDoS protection',
        'VPN for remote access',
        'Network segmentation'
      ]
    },
    {
      category: 'Application Security',
      controls: [
        'Secure coding practices',
        'Regular vulnerability scanning',
        'Code reviews',
        'Web Application Firewall (WAF)',
        'API security testing'
      ]
    },
    {
      category: 'Physical Security',
      controls: [
        'Secure data centers',
        'Access control systems',
        'CCTV surveillance',
        'Environmental controls',
        'Visitor management'
      ]
    }
  ]

  const certifications = [
    {
      name: 'ISO 27001',
      title: 'Information Security Management',
      issuer: 'BSI',
      validUntil: '2025-09-30',
      scope: 'All company operations',
      icon: Award
    },
    {
      name: 'ISO 27701',
      title: 'Privacy Information Management',
      issuer: 'BSI',
      validUntil: '2025-09-30',
      scope: 'All personal data processing',
      icon: Award
    },
    {
      name: 'CSA STAR',
      title: 'Cloud Security Alliance',
      issuer: 'CSA',
      validUntil: '2025-03-31',
      scope: 'Cloud infrastructure',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Compliance & Keamanan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chatzwa berkomitmen untuk memenuhi standar keamanan dan kepatuhan tertinggi.
              Keamanan data dan privasi pengguna adalah prioritas utama kami.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Fingerprint className="w-4 h-4" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4" />
                <span>SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Status */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Status Compliance Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami mempertahankan kepatuhan terhadap berbagai framework keamanan dan privasi
              yang diakui secara internasional.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceFrameworks.map((framework, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      framework.status === 'certified'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`}>
                      <framework.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{framework.name}</h3>
                      <p className="text-sm text-gray-600">{framework.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge variant={framework.status === 'certified' ? 'default' : 'secondary'}>
                        {framework.status === 'certified' ? '✓ Certified' : 'Compliant'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Audit Terakhir:</span>
                      <span className="text-sm text-gray-900">{framework.lastAudit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Audit Berikutnya:</span>
                      <span className="text-sm text-gray-900">{framework.nextAudit}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Scope:</span>
                      <span className="text-sm text-gray-900">{framework.scope}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sertifikasi Keamanan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami telah mendapatkan berbagai sertifikasi keamanan dari lembaga bersertifikat
              internasional yang mengkonfirmasi komitmen kami terhadap keamanan informasi.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{cert.title}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Issuer:</span>
                      <span className="text-gray-900">{cert.issuer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Valid Until:</span>
                      <span className="text-gray-900">{cert.validUntil}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scope:</span>
                      <span className="text-gray-900">{cert.scope}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
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
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
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
                            <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
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

          {/* Security Controls */}
          <Card className="mt-16 border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Kontrol Keamanan Teknis</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-8">
                {securityControls.map((category, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <h4 className="font-semibold text-gray-900 mb-4">{category.category}</h4>
                    <ul className="space-y-2">
                      {category.controls.map((control, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{control}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monitoring and Reporting */}
          <Card className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Monitoring dan Pelaporan</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Continuous Monitoring</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Real-time security event monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Automated threat detection and response</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Security log aggregation and analysis</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Regular Reporting</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Monthly security status reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Quarterly compliance reviews</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Annual third-party assessments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-16">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan tentang Compliance?</h3>
              <p className="text-gray-700 mb-6">
                Jika Anda memiliki pertanyaan tentang praktik kepatuhan kami atau membutuhkan informasi
                lebih detail tentang sertifikasi dan audit kami, silakan hubungi tim compliance kami.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Compliance</p>
                    <p className="text-sm text-gray-700">compliance@Chatzwa.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">DPO</p>
                    <p className="text-sm text-gray-700">dpo@Chatzwa.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gavel className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Legal Counsel</p>
                    <p className="text-sm text-gray-700">legal@Chatzwa.id</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Updated */}
          <div className="mt-16 p-6 bg-gray-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-4">
              Informasi compliance ini berlaku efektif sejak 13 Oktober 2024.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Terakhir diperbarui: 13 Oktober 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>Versi 1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CompliancePage