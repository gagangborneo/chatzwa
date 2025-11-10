export interface BlogPostWithAuthor {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  ogImage: string | null
  canonicalUrl: string | null
  category: string
  tags: string | null
  status: string
  featured: boolean
  publishedAt: Date | null
  viewCount: number
  readTime: number
  likeCount: number
  shareCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
  authorId: string | null
  author: {
    id: string
    name: string | null
    email: string
  } | null
}

export interface BlogSearchResult {
  posts: BlogPostWithAuthor[]
  featuredPost: BlogPostWithAuthor | null
  categories: string[]
  totalPosts: number
  totalPages: number
}