'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, Eye, ArrowRight, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BlogPostWithAuthor } from '@/types/blog'
import { motion } from 'framer-motion'

interface BlogPostCardProps {
  post: BlogPostWithAuthor
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
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

  const categoryColors: { [key: string]: string } = {
    'ai-chatbot': 'bg-blue-100 text-blue-700 border-blue-200',
    'implementasi': 'bg-purple-100 text-purple-700 border-purple-200',
    'tips': 'bg-green-100 text-green-700 border-green-200',
    'bisnis': 'bg-orange-100 text-orange-700 border-orange-200',
    'kesehatan': 'bg-red-100 text-red-700 border-red-200',
    'pendidikan': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'ecommerce': 'bg-pink-100 text-pink-700 border-pink-200',
    'customer-service': 'bg-teal-100 text-teal-700 border-teal-200',
    'teknologi': 'bg-gray-100 text-gray-700 border-gray-200',
    'tutorial': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'general': 'bg-slate-100 text-slate-700 border-slate-200',
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white">
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-yellow-400 text-yellow-900 border-yellow-300 px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </Badge>
          </div>
        )}

        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100">
          {post.ogImage ? (
            <Image
              src={post.ogImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-green-600 text-sm">Artikel</p>
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge
              className={`text-xs ${categoryColors[post.category] || categoryColors.general}`}
            >
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
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-4">
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
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime || getReadingTime(post.content)} menit</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount}</span>
              </div>
            </div>
          </div>

          {/* Read More Button */}
          <Link href={`/blog/${post.slug}`}>
            <Button
              variant="outline"
              className="w-full group/btn border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
            >
              Baca Selengkapnya
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}