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
  country?: string
  language?: string
}

export function useProducts(params: UseProductsParams = {}) {
  const { first = 12, after, country, language } = params

  return useQuery<ProductsApiResponse>({
    queryKey: ['products', { first, after, country, language }],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.set('first', String(first))
      if (after) searchParams.set('after', after)
      if (country) searchParams.set('country', country)
      if (language) searchParams.set('language', language)

      const res = await fetch(`/api/products?${searchParams.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch products')
      return res.json()
    },
  })
}
