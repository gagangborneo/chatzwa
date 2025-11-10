'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BlogPostWithAuthor } from '@/types/blog'
import { motion } from 'framer-motion'

interface BlogRelatedPostsProps {
  posts: BlogPostWithAuthor[]
}

export default function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
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
    const words = content.length / 5
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

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
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
    return colorMap[category] || colorMap.general
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={`/blog/${post.slug}`}>
            <Card className="group h-full hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100">
                <div className="absolute top-4 left-4">
                  <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                    {getCategoryDisplayName(post.category)}
                  </Badge>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl">📝</span>
                    </div>
                    <p className="text-green-600 text-sm">Artikel Terkait</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime || getReadingTime(post.content)} menit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    {post.author && (
                      <span>{post.author.name}</span>
                    )}
                    <span>•</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 group-hover:text-green-700 transition-colors">
                    <span className="text-xs font-medium">Baca</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}