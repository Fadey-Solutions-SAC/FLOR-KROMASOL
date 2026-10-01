import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { WhatsAppIcon } from './icons/WhatsAppIcon'
import type { Product } from '../types'
import { IMPORTANT_NOTICE } from '../config/store'
import { formatPrice, getDiscountPercent } from '../utils/format'
import { Button } from './ui/Button'
import { QuantitySelector } from './ui/QuantitySelector'
import { ReserveButton } from './ReserveButton'
import { StockBadge } from './StockBadge'
import { useStoreUi } from '../context/StoreUiContext'
import { applyCatalogImages } from '../utils/productMedia'
import { useAdmin } from '../context/AdminContext'
import { useCatalog } from '../context/CatalogContext'

type ProductModalProps = {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { handleAddToCart, handleProductWhatsApp } = useStoreUi()
  const { images } = useAdmin()
  const { products } = useCatalog()
  const liveProduct = product
    ? (products.find((item) => item.id === product.id) ?? product)
    : null
  const resolved = liveProduct ? applyCatalogImages(liveProduct, images) : null
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState('')

  useEffect(() => {
    if (!resolved) {
      return
    }
    setQuantity(1)
    setActiveImage(resolved.gallery[0] ?? resolved.image)
  }, [resolved, images])

  useEffect(() => {
    if (!product) {
      return
    }

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
    }
  }, [product, onClose])

  if (!resolved) {
    return null
  }

  const discount = getDiscountPercent(resolved)
  const inStock = resolved.available && resolved.stock > 0
  const maxQty = Math.max(1, resolved.stock)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="animate-overlay-in absolute inset-0 bg-plum/40"
        aria-label="Cerrar detalle"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="animate-fade-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-[1.8rem] bg-white p-4 shadow-2xl sm:max-w-4xl sm:rounded-[1.8rem] sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-plum"
        >
          <X size={18} />
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="rounded-[1.4rem] bg-surface p-4">
              <img
                src={activeImage}
                alt={`${resolved.name} ${resolved.presentation}`}
                className="aspect-square w-full object-contain"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {resolved.gallery.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`Ver imagen ${index + 1} de ${resolved.name}`}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                    activeImage === image ? 'border-magenta' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
              {resolved.category}
            </p>
            <h2 id="product-modal-title" className="font-display mt-2 text-3xl font-bold text-plum">
              {resolved.name}
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {resolved.presentation}
              {resolved.flavor ? ` · ${resolved.flavor}` : ''}
            </p>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="text-2xl font-bold text-magenta">{formatPrice(resolved.price)}</p>
              {resolved.oldPrice && (
                <p className="text-ink/40 line-through">{formatPrice(resolved.oldPrice)}</p>
              )}
              {discount && <span className="text-sm font-semibold text-gold">-{discount}%</span>}
              <StockBadge stock={resolved.stock} />
            </div>
            <p className="mt-2 text-sm font-medium text-ink/60">
              {inStock
                ? `${resolved.stock} ${resolved.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}`
                : 'Producto agotado. Puedes reservarlo para la próxima llegada.'}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">{resolved.description}</p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {resolved.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full bg-pink-soft/70 px-3 py-1 text-xs font-medium text-plum"
                >
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-plum">Información del producto</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
                {resolved.details.map((detail) => (
                  <li key={detail}>• {detail}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl bg-surface p-4">
              <h3 className="text-sm font-semibold text-plum">Información importante</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{IMPORTANT_NOTICE}</p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {inStock ? (
                <>
                  <QuantitySelector
                    value={quantity}
                    max={maxQty}
                    onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
                    onIncrease={() => setQuantity((value) => Math.min(maxQty, value + 1))}
                  />
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleAddToCart(resolved, quantity)
                        onClose()
                      }}
                    >
                      Agregar al carrito
                    </Button>
                    <Button
                      variant="whatsapp"
                      className="flex-1"
                      icon={<WhatsAppIcon />}
                      onClick={() => handleProductWhatsApp(resolved, quantity)}
                    >
                      Comprar por WhatsApp
                    </Button>
                  </div>
                </>
              ) : (
                <ReserveButton product={resolved} className="w-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
