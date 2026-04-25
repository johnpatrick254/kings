// --- Shared types ---

export type Money = {
  amount: string
  currencyCode: string
}

export type ProductImage = {
  url: string
  altText: string | null
  width: number
  height: number
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: Money
  compareAtPrice: Money | null
  selectedOptions: { name: string; value: string }[]
}

export type PageInfo = {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string
  endCursor: string
}

// --- Response types ---

export type ProductListItem = {
  id: string
  title: string
  handle: string
  description: string
  priceRange: {
    minVariantPrice: Money
  }
  images: {
    edges: { node: ProductImage }[]
  }
}

export type ProductDetail = Omit<ProductListItem, 'priceRange'> & {
  descriptionHtml: string
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  images: {
    edges: { node: ProductImage }[]
  }
  variants: {
    edges: { node: ProductVariant }[]
  }
  options: {
    name: string
    values: string[]
  }[]
}

export type GetProductsResponse = {
  products: {
    pageInfo: PageInfo
    edges: { node: ProductListItem }[]
  }
}

export type GetProductResponse = {
  product: ProductDetail | null
}

// --- Variable types ---

export type GetProductsVariables = {
  first: number
  after?: string
  country?: string
  language?: string
}

export type GetProductVariables = {
  handle: string
  country?: string
  language?: string
}

// --- Queries ---

export const GET_PRODUCTS_QUERY = `
  query GetProducts(
    $first: Int!
    $after: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`

export const GET_PRODUCT_QUERY = `
  query GetProduct(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`
