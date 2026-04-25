'use client'

import { useQuery } from '@tanstack/react-query'
import type { ProductDetail } from '@/shopify/queries/products'

type ProductApiResponse = {
  product: ProductDetail
}

type UseProductParams = {
  handle: string
  country?: string
  language?: string
}

export function useProduct({ handle, country, language }: UseProductParams) {
  return useQuery<ProductApiResponse>({
    queryKey: ['product', handle, { country, language }],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (country) searchParams.set('country', country)
      if (language) searchParams.set('language', language)

      const res = await fetch(
        `/api/products/${handle}?${searchParams.toString()}`
      )
      if (res.status === 404) throw new Error('Product not found')
      if (!res.ok) throw new Error('Failed to fetch product')
      return res.json()
    },
    enabled: Boolean(handle),
  })
}
