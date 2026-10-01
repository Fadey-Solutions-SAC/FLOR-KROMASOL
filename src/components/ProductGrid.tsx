import type { Product } from '../types'
import { ProductCard } from './ProductCard'

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-pink-soft bg-white px-6 py-16 text-center">
        <p className="font-display text-lg font-semibold text-plum">
          No encontramos productos con esos criterios.
        </p>
        <p className="mt-2 text-sm text-ink/65">
          Prueba con otra categoría o una búsqueda más general.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
