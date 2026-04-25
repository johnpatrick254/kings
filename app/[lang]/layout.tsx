import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/app/providers'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { locales, localeConfig, defaultLocale, type Locale } from '@/lib/i18n'
import Link from 'next/link'
import '../globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const cfg = localeConfig[(lang as Locale) ?? defaultLocale] ?? localeConfig[defaultLocale]

  return {
    title: { default: 'Kings Store', template: '%s | Kings Store' },
    description: 'Premium products — shop by region.',
    alternates: {
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeConfig[l].hreflang, `/${l}/products`])
        ),
        'x-default': `/${defaultLocale}/products`,
      },
    },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const cfg = localeConfig[(lang as Locale)] ?? localeConfig[defaultLocale]

  return (
    <html
      lang={cfg.htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
              <Link
                href={`/${lang}/products`}
                className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
              >
                Kings Store
              </Link>
              <LocaleSwitcher currentLang={lang as Locale} />
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
