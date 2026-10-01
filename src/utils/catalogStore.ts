import { products as baseProducts } from '../data/products'
import type { Product } from '../types'

export const CATALOG_STORAGE_KEY = 'andromeda-catalog-data-v1'

export type CatalogPatch = Partial<
  Pick<
    Product,
    | 'name'
    | 'presentation'
    | 'price'
    | 'oldPrice'
    | 'stock'
    | 'category'
    | 'categories'
    | 'shortDescription'
    | 'description'
    | 'featured'
    | 'isNew'
  >
>

type StoredCatalog = {
  extras: Product[]
  updates: Record<string, CatalogPatch>
}

export function syncProductFlags(product: Product): Product {
  const stock = Math.max(0, Math.floor(Number(product.stock) || 0))
  const price = Math.max(0, Number(product.price) || 0)
  const oldPrice =
    product.oldPrice && Number(product.oldPrice) > price ? Number(product.oldPrice) : null

  return {
    ...product,
    stock,
    price,
    oldPrice,
    available: stock > 0,
    offer: oldPrice !== null,
  }
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readStoredCatalog(): StoredCatalog {
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY)
    if (!raw) {
      return { extras: [], updates: {} }
    }
    const parsed = JSON.parse(raw) as Partial<StoredCatalog>
    return {
      extras: Array.isArray(parsed.extras) ? parsed.extras.filter(isProductLike) : [],
      updates:
        parsed.updates && typeof parsed.updates === 'object' ? parsed.updates : {},
    }
  } catch {
    return { extras: [], updates: {} }
  }
}

function isProductLike(value: unknown): value is Product {
  if (!value || typeof value !== 'object') {
    return false
  }
  const product = value as Product
  return (
    typeof product.id === 'number' &&
    typeof product.name === 'string' &&
    typeof product.price === 'number'
  )
}

export function loadLiveCatalog(): Product[] {
  const stored = readStoredCatalog()
  const updated = baseProducts.map((product) => {
    const patch = stored.updates[String(product.id)]
    return syncProductFlags({ ...product, ...patch })
  })
  const extras = stored.extras.map((product) => syncProductFlags(product))
  return [...updated, ...extras]
}

export function persistCatalog(liveProducts: Product[]) {
  const baseIds = new Set(baseProducts.map((product) => product.id))
  const updates: Record<string, CatalogPatch> = {}
  const extras: Product[] = []

  liveProducts.forEach((product) => {
    const synced = syncProductFlags(product)
    if (!baseIds.has(synced.id)) {
      extras.push(synced)
      return
    }

    const original = baseProducts.find((item) => item.id === synced.id)
    if (!original) {
      return
    }

    const patch: CatalogPatch = {}
    if (synced.name !== original.name) patch.name = synced.name
    if (synced.presentation !== original.presentation) patch.presentation = synced.presentation
    if (synced.price !== original.price) patch.price = synced.price
    if (synced.oldPrice !== original.oldPrice) patch.oldPrice = synced.oldPrice
    if (synced.stock !== original.stock) patch.stock = synced.stock
    if (synced.category !== original.category) patch.category = synced.category
    if (synced.shortDescription !== original.shortDescription) {
      patch.shortDescription = synced.shortDescription
    }
    updates[String(synced.id)] = patch
  })

  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify({ extras, updates }))
}

export function isInStock(product: Product): boolean {
  return product.stock > 0
}

export function stockLabel(stock: number): string {
  if (stock <= 0) {
    return 'Agotado'
  }
  if (stock === 1) {
    return 'Última unidad'
  }
  if (stock <= 4) {
    return `Quedan ${stock}`
  }
  return `${stock} en stock`
}
