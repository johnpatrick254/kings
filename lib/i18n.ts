export const locales = ['us', 'nl'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'us'

export const localeConfig: Record<
  Locale,
  { country: string; language: string; label: string; htmlLang: string; hreflang: string }
> = {
  us: {
    country: 'US',
    language: 'EN',
    label: 'United States',
    htmlLang: 'en-US',
    hreflang: 'en-US',
  },
  nl: {
    country: 'NL',
    language: 'EN',
    label: 'Netherlands / Europe',
    htmlLang: 'en-NL',
    hreflang: 'en-NL',
  },
}
