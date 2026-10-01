import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { formatPrice, getDiscountPercent } from '../utils/format'
import { Button } from './ui/Button'
import { ReserveButton } from './ReserveButton'
import { StockBadge } from './StockBadge'
import { useStoreUi } from '../context/StoreUiContext'
import { useResolvedProduct } from '../hooks/useResolvedProduct'

type ProductCardProps = {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { openProduct, handleAddToCart } = useStoreUi()
  const resolved = useResolvedProduct(product)
  const discount = getDiscountPercent(resolved)
  const inStock = resolved.available && resolved.stock > 0

  return (
    <article
      className="animate-fade-up group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-pink-soft/80 bg-white p-3 shadow-[0_10px_24px_rgba(91,18,72,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(91,18,72,0.08)]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative overflow-hidden rounded-[1.1rem] bg-surface">
        <img
          src={resolved.image}
          alt={`${resolved.name} ${resolved.presentation}`}
          className="aspect-square w-full object-contain p-4"
          loading="lazy"
          width={480}
          height={480}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {resolved.isNew && (
            <span className="rounded-full bg-plum px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Nuevo
            </span>
          )}
          {resolved.offer && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Oferta
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <StockBadge stock={resolved.stock} />
        </div>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-semibold text-plum">
            Agotado
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-magenta">
          {resolved.category}
        </p>
        <h3 className="font-display mt-1 text-lg font-semibold text-plum">
          {resolved.name}
        </h3>
        <p className="text-sm text-ink/60">{resolved.presentation}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">
          {resolved.shortDescription}
        </p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-lg font-bold text-magenta">{formatPrice(resolved.price)}</p>
          {resolved.oldPrice && (
            <p className="text-sm text-ink/40 line-through">{formatPrice(resolved.oldPrice)}</p>
          )}
          {discount && (
            <span className="text-xs font-semibold text-gold">-{discount}%</span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium text-ink/55">
          {inStock
            ? resolved.stock === 1
              ? 'Última unidad disponible'
              : `${resolved.stock} unidades disponibles`
            : 'Sin stock · puedes reservar para la próxima'}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1 px-3"
            onClick={() => openProduct(resolved)}
          >
            Ver detalles
          </Button>
          {inStock ? (
            <Button
              className="flex-1 px-3"
              onClick={() => handleAddToCart(resolved)}
            >
              Agregar al carrito
            </Button>
          ) : (
            <ReserveButton product={resolved} className="flex-1 px-3" />
          )}
        </div>
        <Link
          to={`/producto/${resolved.slug}`}
          className="mt-3 text-center text-xs font-medium text-ink/50 hover:text-magenta"
        >
          Abrir ficha completa
        </Link>
      </div>
    </article>
  )
}
