import { products as baseProducts } from '../data/products'
import type { Product } from '../types'

export const CATALOG_STORAGE_KEY = 'andromeda-catalog-data-v1'
export const NEW_PRODUCT_IMAGE = '/images/products/producto-sin-foto.svg'

export type CatalogPatch = Partial<
  Pick<
    Product,
    | 'name'
    | 'presentation'
    | 'flavor'
    | 'price'
    | 'oldPrice'
    | 'stock'
    | 'category'
    | 'categories'
    | 'shortDescription'
    | 'description'
    | 'features'
    | 'details'
    | 'gallery'
    | 'image'
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
    flavor: product.flavor?.trim() || undefined,
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

function extraProducts(candidates: Product[], occupiedIds: Set<number>): Product[] {
  const unique = new Map<number, Product>()
  candidates.forEach((product) => {
    if (!occupiedIds.has(product.id)) {
      unique.set(product.id, syncProductFlags(product))
    }
  })
  return [...unique.values()]
}

export function loadLiveCatalog(): Product[] {
  const stored = readStoredCatalog()
  const baseIds = new Set(baseProducts.map((product) => product.id))
  const updated = baseProducts.map((product) => {
    const patch = stored.updates[String(product.id)]
    return syncProductFlags({ ...product, ...patch })
  })
  return [...updated, ...extraProducts(stored.extras, baseIds)]
}

export function mergePublishedCatalog(published: Product[], live: Product[] = []): Product[] {
  const stored = readStoredCatalog()
  const publishedIds = new Set(published.map((product) => product.id))
  const liveById = new Map(live.map((product) => [product.id, product]))
  const updated = published.map((product) => {
    const liveProduct = liveById.get(product.id)
    if (liveProduct && !baseProducts.some((item) => item.id === product.id)) {
      return syncProductFlags(liveProduct)
    }
    const patch = stored.updates[String(product.id)]
    return syncProductFlags({ ...product, ...patch })
  })
  const extras = extraProducts([...stored.extras, ...live], publishedIds)
  return [...updated, ...extras]
}

export function persistCatalog(liveProducts: Product[]) {
  const baseIds = new Set(baseProducts.map((product) => product.id))
  const updates: Record<string, CatalogPatch> = {}
  const extras: Product[] = []

  liveProducts.forEach((product) => {
    const synced = syncProductFlags(product)
    if (!baseIds.has(synced.id)) {
      const image = persistableSrc(synced.image) ?? NEW_PRODUCT_IMAGE
      extras.push({
        ...synced,
        image,
        gallery: persistableImages(synced.gallery).length > 0
          ? persistableImages(synced.gallery)
          : [image],
      })
      return
    }

    const original = baseProducts.find((item) => item.id === synced.id)
    if (!original) {
      return
    }

    const patch: CatalogPatch = {}
    if (synced.name !== original.name) patch.name = synced.name
    if (synced.presentation !== original.presentation) patch.presentation = synced.presentation
    if ((synced.flavor ?? '') !== (original.flavor ?? '')) {
      patch.flavor = synced.flavor?.trim() ? synced.flavor.trim() : ''
    }
    if (synced.price !== original.price) patch.price = synced.price
    if (synced.oldPrice !== original.oldPrice) patch.oldPrice = synced.oldPrice
    if (synced.stock !== original.stock) patch.stock = synced.stock
    if (synced.category !== original.category) patch.category = synced.category
    if (!sameList(synced.categories, original.categories)) patch.categories = synced.categories
    if (synced.shortDescription !== original.shortDescription) {
      patch.shortDescription = synced.shortDescription
    }
    if (synced.description !== original.description) patch.description = synced.description
    if (!sameList(synced.features, original.features)) patch.features = synced.features
    if (!sameList(synced.details, original.details)) patch.details = synced.details
    const persistableImage = persistableSrc(synced.image)
    if (persistableImage && persistableImage !== original.image) {
      patch.image = persistableImage
    }
    const persistableGallery = persistableImages(synced.gallery)
    if (!sameList(persistableGallery, original.gallery)) patch.gallery = persistableGallery
    if (synced.featured !== original.featured) patch.featured = synced.featured
    if (synced.isNew !== original.isNew) patch.isNew = synced.isNew
    updates[String(synced.id)] = patch
  })

  localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify({ extras, updates }))
}

export function isInStock(product: Product): boolean {
  return product.stock > 0
}

function sameList(left: string[] = [], right: string[] = []): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

function persistableSrc(src?: string): string | undefined {
  if (!src || src.startsWith('data:')) {
    return undefined
  }
  return src
}

function persistableImages(images: string[] = []): string[] {
  return images.filter((src) => persistableSrc(src))
}

export function linesToList(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
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
