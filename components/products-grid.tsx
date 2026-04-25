'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useProducts } from '@/hooks/use-products'
import { localeConfig, type Locale } from '@/lib/i18n'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}

export function ProductsGrid({ lang }: { lang: Locale }) {
  const { country, language } = localeConfig[lang]
  const { data, isLoading, isError } = useProducts({ country, language })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load products.</p>
        <p className="mt-1 text-sm text-muted-foreground">Please try refreshing the page.</p>
      </div>
    )
  }

  if (data.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.products.map((product) => {
        const image = product.images.edges[0]?.node
        const { amount, currencyCode } = product.priceRange.minVariantPrice

        return (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-square bg-muted">
              {image ? (
                <Image
                  src={image.url}
                  alt={image.altText ?? product.title}
                  fill
                  loading="eager"
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-base">{product.title}</CardTitle>
            </CardHeader>

            <CardContent className="pb-2 flex-1">
              <Badge variant="secondary">
                {parseFloat(amount).toFixed(2)} {currencyCode}
              </Badge>
            </CardContent>

            <CardFooter>
              <Button asChild className="w-full" size="sm">
                <Link href={`/${lang}/products/${product.handle}`}>View Product</Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
