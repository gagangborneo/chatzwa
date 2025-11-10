'use client'

import { useState } from 'react'
import { Share2, Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BlogShareButtonsProps {
  url: string
  title: string
  description: string
  variant?: 'default' | 'compact'
}

export default function BlogShareButtons({ url, title, description, variant = 'default' }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? url : url
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
  ]

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success('Link berhasil disalin!')
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        toast.success('Link berhasil disalin!')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      toast.error('Gagal menyalin link')
    }
  }

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400')
    toast.success(`Membuka ${platform} untuk berbagi`)
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            size="sm"
            onClick={() => handleShare(link.url, link.name)}
            className={`p-2 ${link.color} text-white hover:opacity-90`}
          >
            <link.icon className="w-4 h-4" />
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="p-2 border-gray-300 hover:bg-gray-50"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Link2 className="w-4 h-4" />}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Bagikan:</span>
      </div>
      <div className="flex items-center gap-2">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="sm"
            onClick={() => handleShare(link.url, link.name)}
            className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <link.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{link.name}</span>
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Tersalin!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Salin Link</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}