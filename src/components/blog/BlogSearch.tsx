'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BlogSearchProps {
  defaultValue?: string
}

export default function BlogSearch({ defaultValue = '' }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setSearchTerm(defaultValue)
  }, [defaultValue])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim())
      params.delete('page') // Reset to first page when searching
    } else {
      params.delete('search')
    }

    router.push(`/blog?${params.toString()}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        type="text"
        placeholder="Cari artikel, topik, atau kata kunci..."
        value={searchTerm}
        onChange={handleInputChange}
        className="pl-12 pr-24 py-4 text-lg bg-white/90 backdrop-blur-sm border-white/20 focus:border-white/40 focus:ring-green-500/20 rounded-xl"
      />
      <Button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg h-10"
      >
        Cari
      </Button>
    </form>
  )
}