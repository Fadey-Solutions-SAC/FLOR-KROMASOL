import { withBase } from './baseUrl'
import type { Product } from '../types'

let catalogImageOverrides: Record<number, string> = {}
let catalogGalleryOverrides: Record<number, string[]> = {}

export function setCatalogImageOverrides(map: Record<number, string>) {
  catalogImageOverrides = map
}

export function setCatalogGalleryOverrides(map: Record<number, string[]>) {
  catalogGalleryOverrides = map
}

export function getCatalogImage(product: Product): string {
  return withBase(catalogImageOverrides[product.id] ?? product.image)
}

export function applyCatalogImages(
  product: Product,
  map: Record<number, string> = catalogImageOverrides,
  galleries: Record<number, string[]> = catalogGalleryOverrides,
): Product {
  const cover = map[product.id] ?? product.image
  const extras = galleries[product.id] ?? []
  const seen = new Set<string>()
  const gallery: string[] = []

  for (const src of [cover, ...product.gallery, ...extras]) {
    if (!src || seen.has(src)) {
      continue
    }
    seen.add(src)
    gallery.push(src)
  }

  return {
    ...product,
    image: withBase(cover),
    gallery: gallery.map((src) => withBase(src)),
  }
}
