import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { applyCatalogImages } from '../utils/productMedia'
import { useAdmin } from '../context/AdminContext'
import { useCatalog } from '../context/CatalogContext'
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon'
import { IMPORTANT_NOTICE, STORE_FULL_NAME } from '../config/store'
import { formatPrice, getDiscountPercent } from '../utils/format'
import { Button } from '../components/ui/Button'
import { QuantitySelector } from '../components/ui/QuantitySelector'
import { ProductCard } from '../components/ProductCard'
import { ReserveButton } from '../components/ReserveButton'
import { StockBadge } from '../components/StockBadge'
import { useStoreUi } from '../context/StoreUiContext'
import { ProductGallery } from '../components/ProductGallery'
import { withBase } from '../utils/baseUrl'

export function ProductPage() {
  const { slug } = useParams()
  const { products, getProductBySlug } = useCatalog()
  const baseProduct = slug ? getProductBySlug(slug) : undefined
  const { images, galleries } = useAdmin()
  const product = baseProduct ? applyCatalogImages(baseProduct, images, galleries) : undefined
  const { handleAddToCart, handleProductWhatsApp } = useStoreUi()
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setQuantity(1)
  }, [product?.id])

  const related = useMemo(
    () => products.filter((item) => item.slug !== product?.slug).slice(0, 3),
    [product, products],
  )

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-plum">Producto no encontrado</h1>
        <p className="mt-3 text-ink/70">Es posible que el enlace haya cambiado.</p>
        <Button className="mt-6" href={withBase('/#catalogo')}>
          Volver al catálogo
        </Button>
      </section>
    )
  }

  const discount = getDiscountPercent(product)
  const inStock = product.available && product.stock > 0
  const maxQty = Math.max(1, product.stock)

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <title>{`${product.name} ${product.presentation} | ${STORE_FULL_NAME}`}</title>
      <meta name="description" content={product.shortDescription} />
      <p className="text-sm text-ink/50">
        <Link to="/" className="hover:text-magenta">Inicio</Link>
        <span> / </span>
        <a href={withBase('/#catalogo')} className="hover:text-magenta">Catálogo</a>
        <span> / </span>
        <span className="text-plum">{product.name}</span>
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <ProductGallery product={product} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-magenta">
            {product.category}
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold text-plum">{product.name}</h1>
          <p className="mt-1 text-ink/60">
            {product.presentation}
            {product.flavor ? ` · ${product.flavor}` : ''}
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <p className="text-3xl font-bold text-magenta">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="text-ink/40 line-through">{formatPrice(product.oldPrice)}</p>
            )}
            {discount && <span className="font-semibold text-gold">-{discount}%</span>}
            <StockBadge stock={product.stock} />
          </div>
          <p className="mt-2 text-sm font-medium text-ink/60">
            {inStock
              ? `${product.stock} ${product.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}`
              : 'Producto agotado. Puedes reservarlo para la próxima llegada.'}
          </p>
          <p className="mt-5 leading-relaxed text-ink/75">{product.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.features.map((feature) => (
              <li key={feature} className="rounded-full bg-pink-soft px-3 py-1 text-xs font-medium text-plum">
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <h2 className="font-semibold text-plum">Información del producto</h2>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/70">
              {product.details.map((detail) => (
                <li key={detail}>• {detail}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6 rounded-2xl bg-surface p-4">
            <h2 className="font-semibold text-plum">Información importante</h2>
            <p className="mt-2 text-sm text-ink/70">{IMPORTANT_NOTICE}</p>
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
                    onClick={() => handleAddToCart(product, quantity)}
                  >
                    Agregar al carrito
                  </Button>
                  <Button
                    variant="whatsapp"
                    className="flex-1"
                    icon={<WhatsAppIcon />}
                    onClick={() => handleProductWhatsApp(product, quantity)}
                  >
                    Comprar por WhatsApp
                  </Button>
                </div>
              </>
            ) : (
              <ReserveButton product={product} className="w-full" />
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-plum">También te puede interesar</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
