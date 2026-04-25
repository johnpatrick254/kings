'use client'

import { useQuery } from '@tanstack/react-query'
import type { ProductListItem, PageInfo } from '@/shopify/queries/products'

type ProductsApiResponse = {
  products: ProductListItem[]
  pageInfo: PageInfo
}

type UseProductsParams = {
  first?: number
  after?: string
  last?: number
  before?: string
  country?: string
  language?: string
}

export function useProducts(params: UseProductsParams = {}) {
  const { first, after, last, before, country, language } = params

  return useQuery<ProductsApiResponse>({
    queryKey: ['products', { first, after, last, before, country, language }],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (last) {
        searchParams.set('last', String(last))
      } else {
        searchParams.set('first', String(first ?? 12))
      }
      if (after) searchParams.set('after', after)
      if (before) searchParams.set('before', before)
      if (country) searchParams.set('country', country)
      if (language) searchParams.set('language', language)

      const res = await fetch(`/api/products?${searchParams.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
  })
}
