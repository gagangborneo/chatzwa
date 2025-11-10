'use client'

import { useState } from 'react'
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  ChevronRight,
  Shield,
  Users,
  Code,
  Zap,
  Globe,
  Building,
  Bot
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Footer = () => {
  const [email, setEmail] = useState('')

  const products = [
    { name: 'AI Chatbot', href: '/products/ai-chatbot', icon: Bot },
    { name: 'WhatsApp Business', href: '/products/whatsapp', icon: MessageCircle },
    { name: 'WordPress Plugin', href: '/products/wordpress', icon: Globe },
    { name: 'Embed Chat', href: '/products/embed-chat', icon: Code }
  ]

  const company = [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Karir', href: '/careers' },
    { name: 'Mitra', href: '/partners' },
    { name: 'Press', href: '/press' }
  ]

  const solutions = [
    { name: 'Customer Service', href: '/solutions/customer-service' },
    { name: 'E-commerce', href: '/solutions/ecommerce' },
    { name: 'Pendidikan', href: '/solutions/pendidikan' },
    { name: 'Kesehatan', href: '/solutions/kesehatan' }
  ]

  const support = [
    { name: 'Blog', href: '/blog' },
    { name: 'Help Center', href: '/help' }
  ]

  const legal = [
    { name: 'Kebijakan Privasi', href: '/privacy' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
    { name: 'Kebijakan Cookie', href: '/cookies' },
    { name: 'Compliance', href: '/compliance' }
  ]

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  return (
    <footer className="relative bg-slate-900 border-t border-white/10">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-black" />

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6 inline-block">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">chatzku</span>
              </Link>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Platform komunikasi generasi berikutnya yang memberdayakan bisnis untuk terhubung, berinteraksi, dan tumbuh dalam skala global dengan solusi AI chatbot yang cerdas.
              </p>

              {/* Newsletter */}
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <h4 className="text-white font-semibold mb-3">Dapatkan Update Terbaru</h4>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 rounded-xl flex-1 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl px-4"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-white font-semibold mb-4">Produk</h3>
              <ul className="space-y-3">
                {products.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors duration-200"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-white font-semibold mb-4">Solusi</h3>
              <ul className="space-y-3">
                {solutions.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                {support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © 2024 chatzku. All rights reserved.
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Indonesia & Global</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-400" />
                  <span>10K+ Pelanggan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Bar */}
          <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <Mail className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Email</div>
                  <div className="text-gray-300 text-sm">hello@chatzku.com</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Telepon</div>
                  <div className="text-gray-300 text-sm">+62 21 1234 5678</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Building className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-white font-medium">Kantor</div>
                  <div className="text-gray-300 text-sm">Jakarta, Indonesia</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer