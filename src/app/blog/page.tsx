import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, User, ArrowRight, Search, Tag, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { db } from '@/lib/db'
import { BlogPostWithAuthor } from '@/types/blog'
import Navigation from '@/components/landing/Navigation'
import Footer from '@/components/landing/Footer'
import BlogSearch from '@/components/blog/BlogSearch'
import BlogCategories from '@/components/blog/BlogCategories'
import BlogFeaturedPost from '@/components/blog/BlogFeaturedPost'
import BlogPostCard from '@/components/blog/BlogPostCard'

interface BlogPageProps {
  searchParams: {
    category?: string
    search?: string
    tag?: string
    page?: string
  }
}

async function getBlogPosts(searchParams: BlogPageProps['searchParams']): Promise<{
  posts: BlogPostWithAuthor[]
  featuredPost: BlogPostWithAuthor | null
  categories: string[]
  totalPosts: number
  totalPages: number
}> {
  // Await searchParams in Next.js 15
  const resolvedParams = await searchParams

  const page = parseInt(resolvedParams.page || '1')
  const limit = 12
  const skip = (page - 1) * limit

  const where = {
    status: 'published' as const,
    ...(resolvedParams.category && { category: resolvedParams.category }),
    ...(resolvedParams.search && {
      OR: [
        { title: { contains: resolvedParams.search, mode: 'insensitive' as const } },
        { excerpt: { contains: resolvedParams.search, mode: 'insensitive' as const } },
        { content: { contains: resolvedParams.search, mode: 'insensitive' as const } },
      ],
    }),
    ...(resolvedParams.tag && { tags: { contains: resolvedParams.tag } }),
  }

  const [posts, featuredPost, categories, totalPosts] = await Promise.all([
    db.blogPost.findMany({
      where,
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
      skip,
      take: limit,
    }),
    db.blogPost.findFirst({
      where: {
        ...where,
        featured: true,
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
    }),
    db.blogPost.findMany({
      where: { status: 'published' },
      select: { category: true },
      distinct: ['category'],
    }),
    db.blogPost.count({ where }),
  ])

  return {
    posts,
    featuredPost,
    categories: categories.map(c => c.category),
    totalPosts,
    totalPages: Math.ceil(totalPosts / limit),
  }
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams
  const { posts, categories } = await getBlogPosts(resolvedParams)

  const title = resolvedParams.category
    ? `Blog ${resolvedParams.category} - Chatzwa`
    : resolvedParams.search
    ? `Pencarian: ${resolvedParams.search} - Blog Chatzwa`
    : 'Blog - Chatzwa | Platform Chatbot AI Indonesia'

  const description = resolvedParams.category
    ? `Temukan artikel terbaik seputar ${resolvedParams.category} di blog Chatzwa. Pelajari implementasi AI chatbot untuk berbagai industri.`
    : resolvedParams.search
    ? `Hasil pencarian untuk "${resolvedParams.search}" di blog Chatzwa. Temukan artikel tentang AI chatbot dan implementasinya.`
    : 'Blog Chatzwa - Temukan artikel terbaru tentang AI chatbot, implementasi bisnis, tips, dan panduan lengkap untuk mengoptimalkan layanan pelanggan Anda.'

  return {
    title,
    description,
    keywords: resolvedParams.category
      ? `${resolvedParams.category}, AI chatbot, blog Chatzwa, implementasi AI`
      : resolvedParams.search
      ? `${resolvedParams.search}, AI chatbot, blog Chatzwa`
      : 'blog Chatzwa, AI chatbot, implementasi AI, panduan chatbot, tips bisnis',
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://Chatzwa.id/blog${resolvedParams.category ? `?category=${resolvedParams.category}` : ''}${resolvedParams.search ? `?search=${resolvedParams.search}` : ''}`,
      images: [
        {
          url: 'https://Chatzwa.id/og-image-blog.jpg',
          width: 1200,
          height: 630,
          alt: 'Blog Chatzwa - AI Chatbot Indonesia',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://Chatzwa.id/og-image-blog.jpg'],
    },
    alternates: {
      canonical: `https://Chatzwa.id/blog${resolvedParams.category ? `?category=${resolvedParams.category}` : ''}${resolvedParams.search ? `?search=${resolvedParams.search}` : ''}`,
    },
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Await searchParams in Next.js 15
  const resolvedParams = await searchParams

  const { posts, featuredPost, categories, totalPosts, totalPages } = await getBlogPosts(resolvedParams)
  const currentPage = parseInt(resolvedParams.page || '1')

  if (posts.length === 0 && !resolvedParams.search && !resolvedParams.category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Belum Ada Artikel</h1>
            <p className="text-xl text-gray-600 mb-8">Kami sedang menyiapkan konten menarik untuk Anda.</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="bg-gradient-to-b from-white to-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Tag className="w-4 h-4 mr-1" />
              Blog & Artikel
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {resolvedParams.category ? `Blog: ${resolvedParams.category}` : 'Blog Chatzwa'}
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8">
              {resolvedParams.category
                ? `Temukan wawasan mendalam seputar ${resolvedParams.category} untuk implementasi AI chatbot yang optimal.`
                : 'Pelajari implementasi AI chatbot, tips bisnis, dan panduan lengkap untuk transformasi digital perusahaan Anda.'
              }
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <BlogSearch defaultValue={resolvedParams.search} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <BlogCategories
                categories={categories}
                currentCategory={resolvedParams.category}
              />

              {/* Stats Card */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Statistik Blog</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Artikel</span>
                      <span className="font-semibold text-green-600">{totalPosts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kategori</span>
                      <span className="font-semibold text-green-600">{categories.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {featuredPost && !resolvedParams.category && !resolvedParams.search && currentPage === 1 && (
              <div className="mb-12">
                <BlogFeaturedPost post={featuredPost} />
              </div>
            )}

            {/* Posts Grid */}
            {posts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {posts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      {currentPage > 1 && (
                        <Link
                          href={`/blog?page=${currentPage - 1}${resolvedParams.category ? `&category=${resolvedParams.category}` : ''}${resolvedParams.search ? `&search=${resolvedParams.search}` : ''}`}
                        >
                          <Button variant="outline" size="sm">
                            Sebelumnya
                          </Button>
                        </Link>
                      )}

                      <span className="px-4 py-2 text-sm text-gray-600">
                        Halaman {currentPage} dari {totalPages}
                      </span>

                      {currentPage < totalPages && (
                        <Link
                          href={`/blog?page=${currentPage + 1}${resolvedParams.category ? `&category=${resolvedParams.category}` : ''}${resolvedParams.search ? `&search=${resolvedParams.search}` : ''}`}
                        >
                          <Button variant="outline" size="sm">
                            Selanjutnya
                          </Button>
                        </Link>
                      )}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {resolvedParams.search || resolvedParams.category
                    ? 'Tidak ada artikel yang ditemukan'
                    : 'Belum ada artikel yang dipublikasikan'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {resolvedParams.search || resolvedParams.category
                    ? 'Coba kata kunci atau kategori lain.'
                    : 'Kami sedang menyiapkan konten menarik untuk Anda.'
                  }
                </p>
                {(resolvedParams.search || resolvedParams.category) && (
                  <Link href="/blog">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Lihat Semua Artikel
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe Newsletter
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Dapatkan tips terbaru tentang AI chatbot dan implementasi bisnis langsung di inbox Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Email Anda"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}