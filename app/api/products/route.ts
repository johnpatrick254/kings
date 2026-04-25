import type { NextRequest } from 'next/server'
import { storefront } from '@/shopify'
import {
  GET_PRODUCTS_QUERY,
  type GetProductsResponse,
  type GetProductsVariables,
} from '@/shopify/queries/products'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const variables: GetProductsVariables = {
    first: Number(searchParams.get('first') ?? 12),
    after: searchParams.get('after') ?? undefined,
    country: searchParams.get('country') ?? undefined,
    language: searchParams.get('language') ?? undefined,
  }

  try {
    const { data, errors } = await storefront.request<GetProductsResponse>(
      GET_PRODUCTS_QUERY,
      { variables }
    )

    if (errors) {
      return Response.json({ error: errors }, { status: 400 })
    }

    return Response.json({
      products: data!.products.edges.map((edge) => edge.node),
      pageInfo: data!.products.pageInfo,
    })
  } catch {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
