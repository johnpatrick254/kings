import type { NextRequest } from 'next/server'
import { storefront } from '@/shopify'
import {
  GET_PRODUCT_QUERY,
  type GetProductResponse,
  type GetProductVariables,
} from '@/shopify/queries/products'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const { searchParams } = request.nextUrl

  const variables: GetProductVariables = {
    handle,
    country: searchParams.get('country') ?? undefined,
    language: searchParams.get('language') ?? undefined,
  }

  try {
    const { data, errors } = await storefront.request<GetProductResponse>(
      GET_PRODUCT_QUERY,
      { variables }
    )

    if (errors) {
      return Response.json({ error: errors }, { status: 400 })
    }

    if (!data?.product) {
      return Response.json({ error: 'Product not found' }, { status: 404 })
    }

    return Response.json({ product: data.product })
  } catch {
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
