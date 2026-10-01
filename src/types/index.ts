export type Product = {
  id: number
  name: string
  slug: string
  category: string
  categories: string[]
  presentation: string
  flavor?: string
  price: number
  oldPrice: number | null
  stock: number
  image: string
  gallery: string[]
  shortDescription: string
  description: string
  features: string[]
  details: string[]
  featured: boolean
  offer: boolean
  isNew: boolean
  available: boolean
}

export type CartItem = {
  productId: number
  name: string
  slug: string
  presentation: string
  price: number
  image: string
  quantity: number
  maxStock: number
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'
