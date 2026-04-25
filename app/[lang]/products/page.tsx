import { Suspense } from 'react'
import { locales, type Locale } from '@/lib/i18n'
import { ProductsGrid } from '@/components/products-grid'
import ProductsLoading from './loading'

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Products</h1>
      <Suspense fallback={<ProductsLoading />}>
        <ProductsGrid lang={lang as Locale} />
      </Suspense>
    </div>
  )
}
