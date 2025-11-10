'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Eye, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BlogPostWithAuthor } from '@/types/blog'
import { motion } from 'framer-motion'

interface BlogFeaturedPostProps {
  post: BlogPostWithAuthor
}

export default function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.length / 5 // Average word length
    return Math.ceil(words / wordsPerMinute)
  }

  const getCategoryDisplayName = (category: string) => {
    const nameMap: { [key: string]: string } = {
      'ai-chatbot': 'AI Chatbot',
      'implementasi': 'Implementasi',
      'tips': 'Tips & Trik',
      'bisnis': 'Bisnis',
      'kesehatan': 'Kesehatan',
      'pendidikan': 'Pendidikan',
      'ecommerce': 'E-commerce',
      'customer-service': 'Customer Service',
      'teknologi': 'Teknologi',
      'tutorial': 'Tutorial',
      'general': 'Umum',
    }
    return nameMap[category] || category
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-emerald-50">
        {/* Featured Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <Badge className="bg-yellow-400 text-yellow-900 border-yellow-300 px-3 py-1 font-semibold">
              Artikel Pilihan
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-2">Artikel Terpilihan</h2>
          <p className="text-green-100">
            Temukan artikel terbaik dan paling relevan untuk implementasi AI chatbot bisnis Anda.
          </p>
        </div>

        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Section */}
            <div className="flex flex-col justify-center">
              {/* Category and Tags */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  {getCategoryDisplayName(post.category)}
                </Badge>
                {post.tags && (
                  <div className="flex gap-1">
                    {post.tags.split(',').slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 mb-6 line-clamp-3">
                {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{post.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime || getReadingTime(post.content)} menit baca</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount} views</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href={`/blog/${post.slug}`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl group"
                >
                  Baca Artikel Lengkap
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Image Section */}
            <div className="relative h-80 lg:h-auto min-h-[300px] rounded-xl overflow-hidden">
              {post.ogImage ? (
                <Image
                  src={post.ogImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">⭐</span>
                    </div>
                    <p className="text-green-700 font-semibold">Artikel Pilihan</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}