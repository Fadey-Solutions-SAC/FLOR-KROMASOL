import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'
import { formatPrice, getCartSubtotal } from '../utils/format'
import { QuantitySelector } from './ui/QuantitySelector'
import { useCart } from '../hooks/useCart'

export function CartItem({ item }: { item: CartItemType }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

  return (
    <article className="flex gap-3 border-b border-pink-soft py-4">
      <img
        src={item.image}
        alt={`${item.name} ${item.presentation}`}
        className="h-20 w-20 rounded-2xl bg-surface object-contain p-1"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-plum">{item.name}</h3>
        <p className="text-sm text-ink/60">{item.presentation}</p>
        <p className="mt-1 text-sm font-semibold text-magenta">
          {formatPrice(getCartSubtotal(item))}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <QuantitySelector
            value={item.quantity}
            max={item.maxStock}
            label=""
            onDecrease={() => decreaseQuantity(item.productId)}
            onIncrease={() => increaseQuantity(item.productId)}
          />
          <button
            type="button"
            onClick={() => removeFromCart(item.productId)}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-magenta"
          >
            <Trash2 size={14} />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  )
}
