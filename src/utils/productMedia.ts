import type { Product } from '../types'

let catalogImageOverrides: Record<number, string> = {}

export function setCatalogImageOverrides(map: Record<number, string>) {
  catalogImageOverrides = map
}

export function getCatalogImage(product: Product): string {
  return catalogImageOverrides[product.id] ?? product.image
}

export function applyCatalogImages(
  product: Product,
  map: Record<number, string> = catalogImageOverrides,
): Product {
  const image = map[product.id] ?? product.image
  if (image === product.image) {
    return product
  }

  const gallery = [image, ...product.gallery.filter((src) => src !== product.image)]
  return { ...product, image, gallery }
}
