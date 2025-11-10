'use client'

import { useState, useEffect } from 'react'
import { List, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BlogTableOfContentsProps {
  content: string
}

interface TOCItem {
  id: string
  title: string
  level: number
}

export default function BlogTableOfContents({ content }: BlogTableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Parse content to extract headings
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

    const extractedHeadings: TOCItem[] = []

    headingElements.forEach((heading, index) => {
      const text = heading.textContent || ''
      const level = parseInt(heading.tagName.charAt(1))
      const id = `heading-${index}`

      // Add ID to heading for smooth scrolling
      heading.id = id

      extractedHeadings.push({
        id,
        title: text,
        level
      })
    })

    setHeadings(extractedHeadings)

    // Update content with heading IDs
    const newContent = doc.body.innerHTML
    const contentElements = document.querySelectorAll('.prose')
    contentElements.forEach(element => {
      if (element.innerHTML !== newContent) {
        element.innerHTML = newContent
      }
    })

    // Handle scroll spy
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      let currentHeading = ''
      extractedHeadings.forEach(heading => {
        const element = document.getElementById(heading.id)
        if (element) {
          const elementTop = element.offsetTop
          if (elementTop <= scrollPosition) {
            currentHeading = heading.id
          }
        }
      })

      setActiveId(currentHeading)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for sticky header
      const elementPosition = element.offsetTop - offset

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  if (headings.length === 0) {
    return null
  }

  return (
    <Card className="sticky top-8">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <List className="w-4 h-4 text-green-600" />
          Daftar Isi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <nav className="space-y-1">
          {headings.map((heading) => (
            <Button
              key={heading.id}
              variant="ghost"
              onClick={() => scrollToHeading(heading.id)}
              className={`w-full justify-start text-left h-auto p-2 font-normal transition-colors ${
                activeId === heading.id
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={{
                paddingLeft: `${(heading.level - 1) * 12 + 8}px`
              }}
            >
              <div className="flex items-center gap-2">
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${
                    activeId === heading.id ? 'translate-x-1' : ''
                  }`}
                />
                <span className="text-xs leading-relaxed line-clamp-2">
                  {heading.title}
                </span>
              </div>
            </Button>
          ))}
        </nav>

        {/* Back to top button */}
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full text-xs"
          >
            Kembali ke Atas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}