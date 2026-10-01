import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PRODUCT_SECTIONS } from '../data/categories'
import type { Product } from '../types'
import {
  loadLiveCatalog,
  mergePublishedCatalog,
  NEW_PRODUCT_IMAGE,
  persistCatalog,
  slugify,
  syncProductFlags,
  type CatalogPatch,
} from '../utils/catalogStore'
import { loadPublishedCatalog, publishLiveCatalog } from '../utils/catalogPublish'

type NewProductInput = {
  name: string
  presentation: string
  flavor?: string
  category: string
  price: number
  oldPrice: number | null
  stock: number
  shortDescription: string
  description?: string
  features?: string[]
  details?: string[]
}

type ProductPatch = CatalogPatch | ((product: Product) => CatalogPatch)

type CatalogContextValue = {
  products: Product[]
  getProductBySlug: (slug: string) => Product | undefined
  getOfferProducts: () => Product[]
  updateProduct: (productId: number, patch: ProductPatch) => void
  addProduct: (input: NewProductInput) => Product | null
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadLiveCatalog())

  const persistAndSet = useCallback((next: Product[]) => {
    const synced = next.map((product) => syncProductFlags(product))
    persistCatalog(synced)
    void publishLiveCatalog(synced)
    return synced
  }, [])

  useEffect(() => {
    let active = true
    loadPublishedCatalog()
      .then((published) => {
        if (!active || !published || published.length === 0) {
          return
        }
        setProducts((current) => {
          const merged = mergePublishedCatalog(published, current)
          const publishedIds = new Set(published.map((product) => product.id))
          if (merged.some((product) => !publishedIds.has(product.id))) {
            persistCatalog(merged)
            void publishLiveCatalog(merged)
          }
          return merged
        })
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  const updateProduct = useCallback(
    (productId: number, patch: ProductPatch) => {
      setProducts((current) =>
        persistAndSet(
          current.map((product) => {
            if (product.id !== productId) {
              return product
            }
            const resolved = typeof patch === 'function' ? patch(product) : patch
            return { ...product, ...resolved }
          }),
        ),
      )
    },
    [persistAndSet],
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

      let created: Product | null = null
      setProducts((current) => {
        const id = Math.max(0, ...current.map((product) => product.id)) + 1
        const slugBase = slugify(`${name}-${presentation}`) || `producto-${id}`
        const slug = current.some((product) => product.slug === slugBase)
          ? `${slugBase}-${id}`
          : slugBase
        const shortDescription =
          input.shortDescription.trim() || 'Producto Andromeda para tu rutina diaria.'
        const description =
          input.description?.trim() ||
          shortDescription ||
          'Producto del catálogo Andromeda. Consulta detalles y disponibilidad por WhatsApp.'
        const features = (input.features ?? []).map((item) => item.trim()).filter(Boolean)
        const details = (input.details ?? []).map((item) => item.trim()).filter(Boolean)

        created = syncProductFlags({
          id,
          name,
          slug,
          category,
          categories: [category],
          presentation: presentation || '1 unidad',
          flavor: input.flavor?.trim() || undefined,
          price: input.price,
          oldPrice: input.oldPrice,
          stock: input.stock,
          image: NEW_PRODUCT_IMAGE,
          gallery: [NEW_PRODUCT_IMAGE],
          shortDescription,
          description,
          features: features.length > 0 ? features : ['Andromeda'],
          details: details.length > 0 ? details : ['Consulta las indicaciones del envase.'],
          featured: false,
          offer: false,
          isNew: true,
          available: input.stock > 0,
        })

        return persistAndSet([...current, created])
      })

      return created
    },
    [persistAndSet],
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
