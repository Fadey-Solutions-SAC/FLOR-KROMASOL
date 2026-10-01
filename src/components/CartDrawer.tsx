import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { WhatsAppIcon } from './icons/WhatsAppIcon'
import { useCart } from '../hooks/useCart'
import { useStoreUi } from '../context/StoreUiContext'
import { formatPrice } from '../utils/format'
import { Button } from './ui/Button'
import { CartItem } from './CartItem'
import { withBase } from '../utils/baseUrl'

type CartDrawerProps = {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, notes, setNotes, isEmpty, getCartTotal } = useCart()
  const { handleOrderWhatsApp } = useStoreUi()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.querySelector<HTMLElement>('button, textarea, a')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="animate-overlay-in absolute inset-0 bg-plum/40"
        aria-label="Cerrar carrito"
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-pink-soft px-5 py-4">
          <h2 id="cart-title" className="font-display text-xl font-bold text-plum">
            Tu carrito
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-plum"
          >
            <X size={18} />
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-display text-xl font-semibold text-plum">Tu carrito está vacío</p>
            <p className="mt-2 text-sm text-ink/65">
              Explora nuestro catálogo y agrega tus productos favoritos.
            </p>
            <Button
              className="mt-6"
              onClick={onClose}
              href={withBase('/#catalogo')}
            >
              Ver catálogo
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}

              <label className="mt-5 block pb-6">
                <span className="text-sm font-medium text-plum">Observaciones</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  placeholder="Ejemplo: quisiera coordinar la entrega."
                  className="mt-2 w-full resize-none rounded-2xl border border-pink-soft bg-surface px-4 py-3 text-sm outline-none focus:border-magenta"
                />
              </label>
            </div>

            <div className="border-t border-pink-soft bg-white px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/65">Subtotal</span>
                <span className="font-semibold">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold text-plum">Total</span>
                <span className="text-lg font-bold text-magenta">{formatPrice(getCartTotal())}</span>
              </div>
              <Button
                variant="whatsapp"
                className="mt-4 w-full"
                icon={<WhatsAppIcon />}
                onClick={handleOrderWhatsApp}
              >
                Pedir por WhatsApp
              </Button>
              <Link
                to="/#catalogo"
                onClick={onClose}
                className="mt-3 block text-center text-sm font-medium text-ink/55 hover:text-magenta"
              >
                Seguir viendo el catálogo
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
