import type { Product } from '../types'
import catalog from './catalog.json'

export const products: Product[] = catalog.products as Product[]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug)
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getOfferProducts(): Product[] {
  return products.filter((product) => product.offer && product.available)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured && product.available)
}
