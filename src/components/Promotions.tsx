import { formatPrice, getDiscountPercent } from '../utils/format'
import { Button } from './ui/Button'
import { ReserveButton } from './ReserveButton'
import { StockBadge } from './StockBadge'
import { useStoreUi } from '../context/StoreUiContext'
import { useCatalog } from '../context/CatalogContext'
import { useResolvedProducts } from '../hooks/useResolvedProduct'

export function Promotions() {
  const { getOfferProducts } = useCatalog()
  const offers = useResolvedProducts(getOfferProducts())
  const { openProduct, handleAddToCart } = useStoreUi()

  if (offers.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Ofertas</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-plum">Promociones</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {offers.map((product) => {
            const discount = getDiscountPercent(product)
            const inStock = product.available && product.stock > 0
            return (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[1.5rem] border border-pink-soft bg-surface sm:flex-row"
              >
                <div className="relative bg-white p-4 sm:w-48">
                  <img
                    src={product.image}
                    alt={`${product.name} ${product.presentation}`}
                    className="h-40 w-full object-contain sm:h-full"
                    loading="lazy"
                  />
                  <div className="absolute right-3 top-3">
                    <StockBadge stock={product.stock} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="w-fit rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                    Oferta
                  </span>
                  <h3 className="font-display mt-3 text-xl font-semibold text-plum">
                    {product.name}
                  </h3>
                  <p className="text-sm text-ink/60">{product.presentation}</p>
                  <p className="mt-1 text-xs font-medium text-ink/55">
                    {inStock
                      ? `${product.stock} unidades disponibles`
                      : 'Agotado · reserva para la próxima'}
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    {product.oldPrice && (
                      <p className="text-sm text-ink/40 line-through">
                        Antes: {formatPrice(product.oldPrice)}
                      </p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-magenta">
                    Ahora: {formatPrice(product.price)}
                  </p>
                  {discount && (
                    <p className="text-sm font-semibold text-gold">-{discount}%</p>
                  )}
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button variant="secondary" onClick={() => openProduct(product)}>
                      Ver detalles
                    </Button>
                    {inStock ? (
                      <Button onClick={() => handleAddToCart(product)}>Agregar al carrito</Button>
                    ) : (
                      <ReserveButton product={product} />
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
