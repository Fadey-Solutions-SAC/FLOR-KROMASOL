import { useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'
import type { Product } from '../types'
import { applyCatalogImages } from '../utils/productMedia'

export function useResolvedProduct(product: Product): Product {
  const { images } = useAdmin()
  return useMemo(() => applyCatalogImages(product, images), [images, product])
}

export function useResolvedProducts(list: Product[]): Product[] {
  const { images } = useAdmin()
  return useMemo(() => list.map((product) => applyCatalogImages(product, images)), [images, list])
}
