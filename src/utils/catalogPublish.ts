import { stripBase, withBase } from './baseUrl'
import type { Product } from '../types'

export async function publishCatalogImage(
  productId: number,
  dataUrl: string,
  kind: 'cover' | 'gallery',
): Promise<string | null> {
  if (!import.meta.env.DEV) {
    return null
  }

  try {
    const response = await fetch('/__catalog/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, kind, dataUrl }),
    })
    if (!response.ok) {
      return null
    }
    const result = (await response.json()) as { url?: string }
    return typeof result.url === 'string' ? result.url : null
  } catch {
    return null
  }
}

export async function publishLiveCatalog(products: Product[]) {
  if (!import.meta.env.DEV) {
    return
  }

  const payload = products.map((product) => ({
    ...product,
    image: stripBase(product.image),
    gallery: product.gallery.map((src) => stripBase(src)).filter((src) => !src.startsWith('data:')),
  }))

  try {
    await fetch('/__catalog/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: payload }),
    })
  } catch {
    // El catálogo local sigue en este navegador si no se pudo copiar al proyecto.
  }
}

export async function loadPublishedCatalog(): Promise<Product[] | null> {
  try {
    const response = await fetch(`${withBase('/catalog.json')}?t=${Date.now()}`, {
      cache: 'no-store',
    })
    if (!response.ok) {
      return null
    }
    const data = (await response.json()) as { products?: Product[] }
    return Array.isArray(data.products) ? data.products : null
  } catch {
    return null
  }
}
