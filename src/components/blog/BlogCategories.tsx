'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tag, FolderOpen } from 'lucide-react'

interface BlogCategoriesProps {
  categories: string[]
  currentCategory?: string
}

export default function BlogCategories({ categories, currentCategory }: BlogCategoriesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category === currentCategory) {
      params.delete('category')
      params.delete('page') // Reset pagination
    } else {
      params.set('category', category)
      params.delete('page') // Reset pagination
    }

    router.push(`/blog?${params.toString()}`)
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'ai-chatbot': '🤖',
      'implementasi': '⚙️',
      'tips': '💡',
      'bisnis': '💼',
      'kesehatan': '🏥',
      'pendidikan': '🎓',
      'ecommerce': '🛒',
      'customer-service': '🎧',
      'teknologi': '💻',
      'tutorial': '📚',
      'general': '📝',
    }
    return iconMap[category] || '📝'
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
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderOpen className="w-5 h-5 text-green-600" />
          Kategori
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* All Categories Link */}
          <Link
            href="/blog"
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !currentCategory
                ? 'bg-green-100 text-green-700 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span>Semua Kategori</span>
            </div>
          </Link>

          {/* Category Links */}
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                currentCategory === category
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryIcon(category)}</span>
                <span className="flex-1">{getCategoryDisplayName(category)}</span>
                {currentCategory === category && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Popular Tags */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Tag Populer
          </h4>
          <div className="flex flex-wrap gap-2">
            {['AI', 'Chatbot', 'WhatsApp', 'Customer Service', 'Otomatisasi'].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-green-50 hover:border-green-300"
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.set('tag', tag)
                  params.delete('page')
                  router.push(`/blog?${params.toString()}`)
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}