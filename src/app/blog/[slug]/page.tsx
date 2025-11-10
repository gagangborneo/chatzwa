import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, Eye, ArrowLeft, ArrowRight, Share2, Bookmark, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/db'
import { BlogPostWithAuthor } from '@/types/blog'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import BlogRelatedPosts from '@/components/blog/BlogRelatedPosts'
import BlogTableOfContents from '@/components/blog/BlogTableOfContents'
import BlogShareButtons from '@/components/blog/BlogShareButtons'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string): Promise<BlogPostWithAuthor | null> {
  const post = await db.blogPost.findUnique({
    where: {
      slug,
      status: 'published',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return post
}

async function getRelatedPosts(currentPost: BlogPostWithAuthor): Promise<BlogPostWithAuthor[]> {
  const relatedPosts = await db.blogPost.findMany({
    where: {
      id: { not: currentPost.id },
      status: 'published',
      OR: [
        { category: currentPost.category },
        { tags: { contains: currentPost.tags?.split(',')[0] } },
      ],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  return relatedPosts
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan - chatzku',
      description: 'Artikel yang Anda cari tidak ditemukan.',
    }
  }

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || `Baca artikel ${post.title} di blog chatzku`
  const keywords = post.metaKeywords || `${post.category}, ${post.tags}, AI chatbot, chatzku, blog Indonesia`

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://chatzku.id/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author?.name || 'chatzku Team'],
      section: post.category,
      tags: post.tags?.split(',').map(tag => tag.trim()) || [],
      images: [
        {
          url: post.ogImage || 'https://chatzku.id/og-image-default.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.ogImage || 'https://chatzku.id/og-image-default.jpg'],
    },
    alternates: {
      canonical: `https://chatzku.id/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post)

  // Increment view count
  await db.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  })

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
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-green-100 mb-6">
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-white capitalize">{getCategoryDisplayName(post.category)}</span>
              <span>/</span>
              <span className="text-white font-medium truncate">
                {post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title}
              </span>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <Badge className={`text-sm ${getCategoryColor(post.category)}`}>
                {getCategoryDisplayName(post.category)}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-green-100">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime || getReadingTime(post.content)} menit baca</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount + 1} views</span>
              </div>
            </div>

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.split(',').map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents - Desktop */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-8">
                <BlogTableOfContents content={post.content} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Article Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <BlogShareButtons
                    url={`https://chatzku.id/blog/${post.slug}`}
                    title={post.title}
                    description={post.excerpt || ''}
                  />
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Simpan
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none prose-gray prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-justify prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700 prose-li:mb-3 prose-li:leading-relaxed prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:leading-relaxed prose-hr:border-gray-200 prose-hr:my-12 prose-img:rounded-lg prose-img:shadow-md prose-a:text-green-600 hover:text-green-700 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-table:border prose-table:border-gray-200 prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-td:border prose-td:border-gray-200">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-gray-600 mb-2">
                      Ditulis oleh <span className="font-semibold text-gray-900">{post.author?.name || 'chatzku Team'}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Terakhir diperbarui: {formatDate(post.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <BlogShareButtons
                      url={`https://chatzku.id/blog/${post.slug}`}
                      title={post.title}
                      description={post.excerpt || ''}
                      variant="compact"
                    />
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Tertarik dengan AI Chatbot?
                </h2>
                <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
                  Pelajari bagaimana AI chatbot dapat mengubah bisnis Anda. Konsultasi gratis dengan tim ahli kami.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl">
                      Mulai Sekarang
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 font-semibold px-6 py-3 rounded-xl">
                    Hubungi Tim
                  </Button>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                    Artikel Terkait
                  </h2>
                  <BlogRelatedPosts posts={relatedPosts} />
                </div>
              )}

              {/* Navigation */}
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                <Link href="/blog" className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}