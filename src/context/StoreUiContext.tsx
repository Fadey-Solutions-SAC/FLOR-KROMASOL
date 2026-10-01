import { isWhatsAppConfigured, WHATSAPP_INFO_MESSAGE } from '../config/store'
import { useCart } from './CartContext'
import {
  generateReservationMessage,
  generateWhatsAppMessage,
  openWhatsApp,
} from '../utils/whatsapp'
import { createContext, useContext, type ReactNode } from 'react'
import { useUi } from '../hooks/useUi'
import type { Product } from '../types'
import { productToCartItem } from '../utils/format'
import { isInStock } from '../utils/catalogStore'

type StoreUiValue = ReturnType<typeof useUi> & {
  handleAddToCart: (product: Product, quantity?: number) => void
  handleWhatsAppInfo: () => void
  handleOrderWhatsApp: () => void
  handleProductWhatsApp: (product: Product, quantity?: number) => void
  handleReserve: (product: Product) => void
}

const StoreUiContext = createContext<StoreUiValue | null>(null)

export function StoreUiProvider({ children }: { children: ReactNode }) {
  const ui = useUi()
  const { addToCart, items, notes } = useCart()

  const handleAddToCart = (product: Product, quantity = 1) => {
    if (!isInStock(product)) {
      ui.showToast('Este producto está agotado. Puedes reservarlo para la próxima.')
      return
    }

    const added = addToCart(product, quantity)
    if (!added) {
      ui.showToast('No hay más stock disponible de este producto.')
      return
    }

    ui.showToast('✓ Producto agregado al carrito')
  }

  const handleWhatsAppInfo = () => {
    if (!isWhatsAppConfigured()) {
      ui.openConfig()
      return
    }

    openWhatsApp(WHATSAPP_INFO_MESSAGE)
  }

  const handleOrderWhatsApp = () => {
    if (items.length === 0) {
      ui.showToast('Tu carrito está vacío')
      return
    }

    if (!isWhatsAppConfigured()) {
      ui.openConfig()
      return
    }

    const sent = openWhatsApp(generateWhatsAppMessage(items, notes))
    if (sent) {
      ui.closeCart()
      ui.openOrderReady()
    }
  }

  const handleProductWhatsApp = (product: Product, quantity = 1) => {
    if (!isInStock(product) || quantity < 1) {
      ui.showToast('Este producto está agotado. Puedes reservarlo para la próxima.')
      return
    }

    if (!isWhatsAppConfigured()) {
      ui.openConfig()
      return
    }

    const sent = openWhatsApp(
      generateWhatsAppMessage([productToCartItem(product, quantity)], notes),
    )
    if (sent) {
      ui.openOrderReady()
    }
  }

  const handleReserve = (product: Product) => {
    if (!isWhatsAppConfigured()) {
      ui.openConfig()
      return
    }

    openWhatsApp(generateReservationMessage(product))
  }

  return (
    <StoreUiContext.Provider
      value={{
        ...ui,
        handleAddToCart,
        handleWhatsAppInfo,
        handleOrderWhatsApp,
        handleProductWhatsApp,
        handleReserve,
      }}
    >
      {children}
    </StoreUiContext.Provider>
  )
}

export function useStoreUi() {
  const context = useContext(StoreUiContext)
  if (!context) {
    throw new Error('useStoreUi debe usarse dentro de StoreUiProvider')
  }
  return context
}
