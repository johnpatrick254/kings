import { createStorefrontApiClient } from '@shopify/storefront-api-client'

export const storefront = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: '2024-01',
  publicAccessToken: process.env.STOREFRONT_API_TOKEN!,
})
