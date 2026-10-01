import { useCallback, useState } from 'react'
import type { Product } from '../types'

export function useUi() {
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [orderReadyOpen, setOrderReadyOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const openProduct = useCallback((product: Product) => setSelectedProduct(product), [])
  const closeProduct = useCallback(() => setSelectedProduct(null), [])
  const openOrderReady = useCallback(() => setOrderReadyOpen(true), [])
  const closeOrderReady = useCallback(() => setOrderReadyOpen(false), [])
  const openConfig = useCallback(() => setConfigOpen(true), [])
  const closeConfig = useCallback(() => setConfigOpen(false), [])

  const showToast = useCallback((message: string) => {
    setToast(message)
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  return {
    cartOpen,
    selectedProduct,
    orderReadyOpen,
    configOpen,
    toast,
    openCart,
    closeCart,
    openProduct,
    closeProduct,
    openOrderReady,
    closeOrderReady,
    openConfig,
    closeConfig,
    showToast,
    hideToast,
  }
}
