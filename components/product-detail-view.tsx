'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useProduct } from '@/hooks/use-product'
import { localeConfig, type Locale } from '@/lib/i18n'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function ProductDetailSkeleton() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function ProductDetailView({ lang, handle }: { lang: Locale; handle: string }) {
  const { country, language } = localeConfig[lang]
  const { data, isLoading, isError } = useProduct({ handle, country, language })
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')

  if (isLoading) return <ProductDetailSkeleton />

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load product.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/${lang}/products`}>Back to Products</Link>
        </Button>
      </div>
    )
  }

  if (!data?.product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium">Product not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href={`/${lang}/products`}>Back to Products</Link>
        </Button>
      </div>
    )
  }

  const { product } = data
  const images = product.images.edges.map((e) => e.node)
  const variants = product.variants.edges.map((e) => e.node)
  const primaryImage = images[0]
  const { minVariantPrice, maxVariantPrice } = product.priceRange
  const isAvailable = variants.some((v) => v.availableForSale)

  const priceDisplay =
    minVariantPrice.amount === maxVariantPrice.amount
      ? `${parseFloat(minVariantPrice.amount).toFixed(2)} ${minVariantPrice.currencyCode}`
      : `${parseFloat(minVariantPrice.amount).toFixed(2)} – ${parseFloat(maxVariantPrice.amount).toFixed(2)} ${minVariantPrice.currencyCode}`

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.title}
            fill
            loading="eager"
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
          <p className="mt-3 text-2xl font-semibold">{priceDisplay}</p>
        </div>

        <div className="flex gap-2">
          <Badge variant={isAvailable ? 'default' : 'secondary'}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>

        {product.options.length > 0 && product.options[0].values.length > 1 && (
          <div className="flex flex-col gap-3">
            {product.options.map((option) => (
              <div key={option.name}>
                <p className="mb-1.5 text-sm font-medium">{option.name}</p>
                <Select
                  onValueChange={(val) => {
                    const matched = variants.find((v) =>
                      v.selectedOptions.some(
                        (o) => o.name === option.name && o.value === val
                      )
                    )
                    if (matched) setSelectedVariantId(matched.id)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${option.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {product.description && (
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Button size="lg" disabled={!isAvailable}>
            {isAvailable ? 'Add to Cart' : 'Unavailable'}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${lang}/products`}>← Back to Products</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
