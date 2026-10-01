import { getCatalogImage } from './productMedia'
import { CURRENCY_SYMBOL, LOCALE } from '../config/store'
import type { CartItem, Product, SortOption } from '../types'

export function formatPrice(value: number): string {
  const formatted = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

  return `${CURRENCY_SYMBOL} ${formatted}`
}

export function getDiscountPercent(product: Product): number | null {
  if (!product.oldPrice || product.oldPrice <= product.price) {
    return null
  }

  return Math.round((1 - product.price / product.oldPrice) * 100)
}

export function getCartSubtotal(item: CartItem): number {
  return roundMoney(item.price * item.quantity)
}

export function getCartTotal(items: CartItem[]): number {
  return roundMoney(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
}

export function getCartItemsCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

export function filterProducts(
  products: Product[],
  query: string,
  category: string,
  sort: SortOption,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase()

  const filtered = products.filter((product) => {
    const matchesCategory =
      category === 'Todos' ||
      product.category === category ||
      product.categories.includes(category)
    const matchesQuery =
      !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.presentation.toLowerCase().includes(normalizedQuery) ||
      product.shortDescription.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      (product.flavor?.toLowerCase().includes(normalizedQuery) ?? false)

    return matchesCategory && matchesQuery
  })

  const sorted = [...filtered]

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      break
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id)
  }

  return sorted
}

export function productToCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    name: product.name,
    slug: product.slug,
    presentation: product.presentation,
    price: product.price,
    image: getCatalogImage(product),
    quantity,
    maxStock: Math.max(0, product.stock ?? 0),
  }
}
