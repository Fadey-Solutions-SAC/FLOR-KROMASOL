import { useMemo } from 'react'
import { useAdmin } from '../context/AdminContext'
import type { Product } from '../types'
import { applyCatalogImages } from '../utils/productMedia'

export function useResolvedProduct(product: Product): Product {
  const { images, galleries } = useAdmin()
  return useMemo(
    () => applyCatalogImages(product, images, galleries),
    [galleries, images, product],
  )
}

export function useResolvedProducts(list: Product[]): Product[] {
  const { images, galleries } = useAdmin()
  return useMemo(
    () => list.map((product) => applyCatalogImages(product, images, galleries)),
    [galleries, images, list],
  )
}
