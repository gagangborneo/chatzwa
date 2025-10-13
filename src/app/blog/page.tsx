'use client'

import { useState } from 'react'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import {
  Calendar,
  User,
  Clock,
  TrendingUp,
  MessageCircle,
  Smartphone,
  Users,
  ShoppingCart,
  GraduationCap,
  Heart,
  Search,
  Filter,
  ChevronRight,
  Eye,
  Share2,
  Bookmark
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua', icon: MessageCircle },
    { id: 'telekomunikasi', name: 'Telekomunikasi', icon: Smartphone },
    { id: 'customer-service', name: 'Customer Service', icon: Users },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'pendidikan', name: 'Pendidikan', icon: GraduationCap },
    { id: 'kesehatan', name: 'Kesehatan', icon: Heart }
  ]

  const blogPosts = [
    {
      id: 1,
      title: 'AI Chatbot: Transformasi Layanan Pelanggan di Era Digital',
      excerpt: 'Bagaimana teknologi AI chatbot merevolusi cara bisnis berinteraksi dengan pelanggan dan meningkatkan efisiensi layanan.',
      author: 'Sarah Wijaya',
      date: '15 Oktober 2024',
      readTime: '5 menit baca',
      category: 'customer-service',
      image: '/blog/ai-customer-service.jpg',
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: 'WhatsApp Business API: Strategi Komunikasi untuk UKM',
      excerpt: 'Panduan lengkap implementasi WhatsApp Business API untuk meningkatkan engagement pelanggan dan penjualan.',
      author: 'Budi Santoso',
      date: '12 Oktober 2024',
      readTime: '7 menit baca',
      category: 'telekomunikasi',
      image: '/blog/whatsapp-business.jpg',
      views: 980
    },
    {
      id: 3,
      title: 'E-commerce 2024: Tren Digital Shopping di Indonesia',
      excerpt: 'Analisis mendalam tentang evolusi e-commerce Indonesia dan strategi AI untuk meningkatkan conversion rate.',
      author: 'Rina Sari',
      date: '10 Oktober 2024',
      readTime: '6 menit baca',
      category: 'ecommerce',
      image: '/blog/ecommerce-trends.jpg',
      views: 1450
    },
    {
      id: 4,
      title: 'EdTech Revolution: AI dalam Pembelajaran Modern',
      excerpt: 'Bagaimana teknologi AI mengubah lanskap pendidikan Indonesia dan menciptakan pengalaman belajar yang personal.',
      author: 'Ahmad Hidayat',
      date: '8 Oktober 2024',
      readTime: '8 menit baca',
      category: 'pendidikan',
      image: '/blog/edtech-revolution.jpg',
      views: 750
    },
    {
      id: 5,
      title: 'Digital Health: Telemedicine dan Patient Support',
      excerpt: 'Peran teknologi digital dalam transformasi layanan kesehatan dan improving patient outcomes.',
      author: 'Dr. Siti Nurhaliza',
      date: '5 Oktober 2024',
      readTime: '6 menit baca',
      category: 'kesehatan',
      image: '/blog/digital-health.jpg',
      views: 620
    },
    {
      id: 6,
      title: 'Omnichannel Communication: Future of Customer Service',
      excerpt: 'Strategi integrasi multi-channel untuk customer experience yang seamless dan personal.',
      author: 'Michael Chen',
      date: '3 Oktober 2024',
      readTime: '7 menit baca',
      category: 'telekomunikasi',
      image: '/blog/omnichannel-comm.jpg',
      views: 890
    },
    {
      id: 7,
      title: 'AI-Powered Sales: Chatbots untuk Revenue Growth',
      excerpt: 'Implementasi chatbot AI untuk meningkatkan lead generation dan conversion di berbagai industri.',
      author: 'Lisa Anderson',
      date: '1 Oktober 2024',
      readTime: '5 menit baca',
      category: 'ecommerce',
      image: '/blog/ai-sales.jpg',
      views: 1100
    },
    {
      id: 8,
      title: 'Smart Campus: Digitalisasi Layanan Pendidikan',
      excerpt: 'Transformasi digital dalam manajemen kampus dan student engagement dengan teknologi AI.',
      author: 'Prof. David Kumar',
      date: '28 September 2024',
      readTime: '6 menit baca',
      category: 'pendidikan',
      image: '/blog/smart-campus.jpg',
      views: 580
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <MessageCircle className="w-4 h-4 mr-2" />
              Blog
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Insights & Trends
              <br />
              Digital Solutions
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Temukan artikel terbaru tentang telekomunikasi digital, solusi AI,
              dan tren teknologi yang mengubah berbagai industri
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'all' && featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Artikel Pilihan</h2>
              <p className="text-gray-600">Konten terbaik yang wajib Anda baca</p>
            </div>

            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative h-64 bg-gradient-to-br from-blue-500 to-indigo-600">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 mb-3">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Featured
                      </Badge>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'all' ? 'Semua Artikel' : `Artikel ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <p className="text-gray-600">{filteredPosts.length} artikel ditemukan</p>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-500">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {categories.find(c => c.id === post.category)?.name}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author.split(' ')[0]}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-2">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
              <p className="text-gray-600">Coba kata kunci lain atau pilih kategori yang berbeda</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Dapatkan Update Terbaru</h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe untuk mendapatkan artikel terbaru tentang digital transformation dan AI solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Email Anda"
                className="flex-1 px-4 py-3 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 rounded-xl"
              />
              <Button className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default BlogPage