import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { CART_STORAGE_KEY } from '../config/store'
import type { CartItem, Product } from '../types'
import { getCartItemsCount, getCartTotal, productToCartItem } from '../utils/format'

type CartState = {
  items: CartItem[]
  notes: string
}

type CartContextValue = {
  items: CartItem[]
  notes: string
  setNotes: (notes: string) => void
  addToCart: (product: Product, quantity?: number) => boolean
  removeFromCart: (productId: number) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  setQuantity: (productId: number, quantity: number) => void
  syncWithCatalog: (products: Product[]) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
  isEmpty: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return { items: [], notes: '' }
    }

    const parsed = JSON.parse(raw) as Partial<CartState>
    const items = Array.isArray(parsed.items)
      ? parsed.items.filter(isValidCartItem).map(withMaxStock)
      : []

    return {
      items,
      notes: typeof parsed.notes === 'string' ? parsed.notes : '',
    }
  } catch {
    return { items: [], notes: '' }
  }
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') {
    return false
  }

  const candidate = item as CartItem
  return (
    typeof candidate.productId === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.presentation === 'string' &&
    typeof candidate.price === 'number' &&
    candidate.price >= 0 &&
    typeof candidate.image === 'string' &&
    typeof candidate.quantity === 'number' &&
    candidate.quantity >= 1
  )
}

function withMaxStock(item: CartItem): CartItem {
  return {
    ...item,
    maxStock: typeof item.maxStock === 'number' && item.maxStock >= 0 ? item.maxStock : 99,
  }
}

function persistCart(state: CartState) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(() => loadCart())

  const update = useCallback((updater: (current: CartState) => CartState) => {
    setState((current) => {
      const next = updater(current)
      persistCart(next)
      return next
    })
  }, [])

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const stock = Math.max(0, product.stock ?? 0)
    if (!product.available || stock < 1 || quantity < 1) {
      return false
    }

    const existing = state.items.find((item) => item.productId === product.id)
    const currentQty = existing?.quantity ?? 0
    const nextQty = Math.min(stock, currentQty + quantity)
    if (nextQty <= currentQty) {
      return false
    }

    update((current) => {
      const currentItem = current.items.find((item) => item.productId === product.id)
      if (currentItem) {
        return {
          ...current,
          items: current.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: nextQty, maxStock: stock, price: product.price }
              : item,
          ),
        }
      }

      return {
        ...current,
        items: [...current.items, productToCartItem(product, nextQty)],
      }
    })

    return true
  }, [state.items, update])

  const removeFromCart = useCallback((productId: number) => {
    update((current) => {
      const items = current.items.filter((item) => item.productId !== productId)
      return {
        items,
        notes: items.length === 0 ? '' : current.notes,
      }
    })
  }, [update])

  const increaseQuantity = useCallback((productId: number) => {
    update((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.maxStock, item.quantity + 1) }
          : item,
      ),
    }))
  }, [update])

  const decreaseQuantity = useCallback((productId: number) => {
    update((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    }))
  }, [update])

  const setQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) {
      return
    }

    update((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(item.maxStock, quantity) }
          : item,
      ),
    }))
  }, [update])

  const syncWithCatalog = useCallback((products: Product[]) => {
    update((current) => {
      const nextItems = current.items.flatMap((item) => {
        const product = products.find((entry) => entry.id === item.productId)
        if (!product || product.stock < 1) {
          return []
        }

        return [
          {
            ...item,
            price: product.price,
            maxStock: product.stock,
            quantity: Math.min(item.quantity, product.stock),
          },
        ]
      })

      const unchanged =
        nextItems.length === current.items.length &&
        nextItems.every((item, index) => {
          const previous = current.items[index]
          return (
            previous &&
            previous.productId === item.productId &&
            previous.quantity === item.quantity &&
            previous.maxStock === item.maxStock &&
            previous.price === item.price
          )
        })

      if (unchanged) {
        return current
      }

      return {
        items: nextItems,
        notes: nextItems.length === 0 ? '' : current.notes,
      }
    })
  }, [update])

  const clearCart = useCallback(() => {
    update(() => ({ items: [], notes: '' }))
  }, [update])

  const setNotes = useCallback((notes: string) => {
    update((current) => ({ ...current, notes }))
  }, [update])

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      notes: state.notes,
      setNotes,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      setQuantity,
      syncWithCatalog,
      clearCart,
      getCartTotal: () => getCartTotal(state.items),
      getCartItemsCount: () => getCartItemsCount(state.items),
      isEmpty: state.items.length === 0,
    }),
    [
      addToCart,
      clearCart,
      decreaseQuantity,
      increaseQuantity,
      removeFromCart,
      setNotes,
      setQuantity,
      syncWithCatalog,
      state.items,
      state.notes,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return context
}
