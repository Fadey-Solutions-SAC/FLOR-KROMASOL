import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CATEGORIES } from '../data/categories'
import { useCatalog } from '../context/CatalogContext'
import type { SortOption } from '../types'
import { filterProducts } from '../utils/format'
import { ProductGrid } from './ProductGrid'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre' },
]

export function Catalog() {
  const { products } = useCatalog()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [sort, setSort] = useState<SortOption>('featured')

  const visibleProducts = useMemo(
    () => filterProducts(products, query, category, sort),
    [products, query, category, sort],
  )

  return (
    <section id="catalogo" className="scroll-mt-24 bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-plum">Nuestro catálogo</h2>
          <p className="mt-3 text-ink/70">Elige tus productos y arma tu pedido.</p>
        </div>

        <div className="mt-8 rounded-[1.6rem] bg-white p-4 shadow-[0_10px_30px_rgba(91,18,72,0.05)] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Buscar productos</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre, presentación o sabor"
                className="h-12 w-full rounded-full border border-pink-soft bg-surface pl-11 pr-4 text-sm outline-none transition focus:border-magenta"
              />
            </label>
            <label className="lg:w-64">
              <span className="sr-only">Ordenar</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="h-12 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm outline-none focus:border-magenta"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categorías">
            {CATEGORIES.map((item) => {
              const active = item === category
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                    active
                      ? 'bg-magenta text-white'
                      : 'bg-surface text-plum hover:bg-pink-soft'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <ProductGrid products={visibleProducts} />
        </div>
      </div>
    </section>
  )
}
