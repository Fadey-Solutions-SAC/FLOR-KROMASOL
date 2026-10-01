import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PRODUCT_SECTIONS } from '../data/categories'
import type { Product } from '../types'
import {
  loadLiveCatalog,
  persistCatalog,
  slugify,
  syncProductFlags,
  type CatalogPatch,
} from '../utils/catalogStore'

type NewProductInput = {
  name: string
  presentation: string
  category: string
  price: number
  oldPrice: number | null
  stock: number
  shortDescription: string
}

type CatalogContextValue = {
  products: Product[]
  getProductBySlug: (slug: string) => Product | undefined
  getOfferProducts: () => Product[]
  updateProduct: (productId: number, patch: CatalogPatch) => void
  addProduct: (input: NewProductInput) => Product | null
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadLiveCatalog())

  const commit = useCallback((next: Product[]) => {
    const synced = next.map((product) => syncProductFlags(product))
    persistCatalog(synced)
    setProducts(synced)
  }, [])

  const updateProduct = useCallback(
    (productId: number, patch: CatalogPatch) => {
      commit(
        products.map((product) =>
          product.id === productId ? { ...product, ...patch } : product,
        ),
      )
    },
    [commit, products],
  )

  const addProduct = useCallback(
    (input: NewProductInput) => {
      const name = input.name.trim()
      const presentation = input.presentation.trim()
      const category = PRODUCT_SECTIONS.includes(
        input.category as (typeof PRODUCT_SECTIONS)[number],
      )
        ? input.category
        : 'Suplementos'

      if (!name || input.price < 0 || input.stock < 0) {
        return null
      }

      const id = Math.max(0, ...products.map((product) => product.id)) + 1
      const slugBase = slugify(`${name}-${presentation}`) || `producto-${id}`
      const slug = products.some((product) => product.slug === slugBase)
        ? `${slugBase}-${id}`
        : slugBase

      const product = syncProductFlags({
        id,
        name,
        slug,
        category,
        categories: [category],
        presentation: presentation || '1 unidad',
        price: input.price,
        oldPrice: input.oldPrice,
        stock: input.stock,
        image: '/images/products/andromeda-630g.jpg',
        gallery: ['/images/products/andromeda-630g.jpg'],
        shortDescription:
          input.shortDescription.trim() || 'Producto Andromeda para tu rutina diaria.',
        description:
          input.shortDescription.trim() ||
          'Producto del catálogo Andromeda. Consulta detalles y disponibilidad por WhatsApp.',
        features: ['Andromeda'],
        details: ['Consulta las indicaciones del envase.'],
        featured: false,
        offer: false,
        isNew: true,
        available: input.stock > 0,
      })

      commit([...products, product])
      return product
    },
    [commit, products],
  )

  const value = useMemo<CatalogContextValue>(
    () => ({
      products,
      getProductBySlug: (slug) => products.find((product) => product.slug === slug),
      getOfferProducts: () => products.filter((product) => product.offer),
      updateProduct,
      addProduct,
    }),
    [addProduct, products, updateProduct],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalog debe usarse dentro de CatalogProvider')
  }
  return context
}
