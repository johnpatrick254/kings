import type { Metadata } from 'next'
import { locales, localeConfig, defaultLocale, type Locale } from '@/lib/i18n'
import { storefront } from '@/shopify'
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  type GetProductsResponse,
  type GetProductResponse,
} from '@/shopify/queries/products'
import { ProductDetailView } from '@/components/product-detail-view'

export async function generateStaticParams() {
  const params: { lang: string; handle: string }[] = []

  for (const lang of locales) {
    const { country, language } = localeConfig[lang]
    let after: string | undefined

    do {
      const { data } = await storefront.request<GetProductsResponse>(GET_PRODUCTS_QUERY, {
        variables: { first: 250, country, language, after },
      })

      if (!data) break

      data.products.edges.forEach(({ node }) => {
        params.push({ lang, handle: node.handle })
      })

      after = data.products.pageInfo.hasNextPage
        ? data.products.pageInfo.endCursor
        : undefined
    } while (after)
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; handle: string }>
}): Promise<Metadata> {
  const { lang, handle } = await params
  const cfg = localeConfig[(lang as Locale)] ?? localeConfig[defaultLocale]

  const { data } = await storefront.request<GetProductResponse>(GET_PRODUCT_QUERY, {
    variables: { handle, country: cfg.country, language: cfg.language },
  })

  if (!data?.product) {
    return { title: 'Product Not Found' }
  }

  const { title, description, images } = data.product
  const image = images.edges[0]?.node

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: [{ url: image.url, alt: image.altText ?? title }],
      }),
    },
    alternates: {
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeConfig[l].hreflang, `/${l}/products/${handle}`])
        ),
        'x-default': `/${defaultLocale}/products/${handle}`,
      },
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; handle: string }>
}) {
  const { lang, handle } = await params

  return <ProductDetailView lang={lang as Locale} handle={handle} />
}
