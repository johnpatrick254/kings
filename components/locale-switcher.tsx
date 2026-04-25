'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales, localeConfig, type Locale } from '@/lib/i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LocaleSwitcher({ currentLang }: { currentLang: Locale }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (locale: string) => {
    const segments = pathname.split('/')
    segments[1] = locale
    router.push(segments.join('/'))
  }

  return (
    <Select value={currentLang} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeConfig[locale].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
