'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages, ChevronDown } from 'lucide-react'

const languages = [
  {
    code: 'id' as const,
    name: 'Bahasa Indonesia',
    flag: '🇮🇩'
  },
  {
    code: 'en' as const,
    name: 'English',
    flag: '🇬🇧'
  }
]

export default function LanguageDropdown() {
  const { language, setLanguage, t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-8 px-3"
        >
          <span className="text-base">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline text-sm">
            {currentLanguage?.name}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              language === lang.code ? 'bg-slate-100' : ''
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="text-xs text-slate-500">
                  {t('language.current')}
                </span>
              )}
            </div>
            {language === lang.code && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
              </div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}