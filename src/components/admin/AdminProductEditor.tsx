import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Pencil, Trash2 } from 'lucide-react'
import { PRODUCT_SECTIONS } from '../../data/categories'
import type { Product } from '../../types'
import { Button } from '../ui/Button'
import { useAdmin } from '../../context/AdminContext'
import { useCatalog } from '../../context/CatalogContext'
import { applyCatalogImages } from '../../utils/productMedia'
import { stripBase } from '../../utils/baseUrl'
import { formatPrice } from '../../utils/format'
import { linesToList, stockLabel } from '../../utils/catalogStore'

const fieldClass =
  'mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm outline-none focus:border-magenta'
const areaClass =
  'mt-1 min-h-24 w-full rounded-2xl border border-pink-soft bg-surface px-4 py-3 text-sm outline-none focus:border-magenta'

type AdminProductEditorProps = {
  product: Product
  editing: boolean
  onToggle: () => void
  onMessage: (message: string) => void
}

export function AdminProductEditor({
  product,
  editing,
  onToggle,
  onMessage,
}: AdminProductEditorProps) {
  const {
    images,
    galleries,
    replaceProductImage,
    restoreProductImage,
    addGalleryImage,
    removeGalleryImage,
  } = useAdmin()
  const { updateProduct } = useCatalog()
  const [busy, setBusy] = useState(false)
  const [featuresText, setFeaturesText] = useState(product.features.join('\n'))
  const [detailsText, setDetailsText] = useState(product.details.join('\n'))
  const coverInput = useRef<HTMLInputElement | null>(null)
  const galleryInput = useRef<HTMLInputElement | null>(null)
  const resolved = applyCatalogImages(product, images, galleries)
  const extraImages = galleries[product.id] ?? []

  useEffect(() => {
    setFeaturesText(product.features.join('\n'))
  }, [product.features])

  useEffect(() => {
    setDetailsText(product.details.join('\n'))
  }, [product.details])

  const setCategory = (category: string) => {
    const nextCategories = product.categories.includes(category)
      ? product.categories
      : [category, ...product.categories]
    updateProduct(product.id, { category, categories: nextCategories })
  }

  const toggleSection = (section: string) => {
    const selected = product.categories.includes(section)
    const next = selected
      ? product.categories.filter((item) => item !== section)
      : [...product.categories, section]
    const categories = next.length > 0 ? next : [product.category]
    const category = categories.includes(product.category) ? product.category : categories[0]
    updateProduct(product.id, { category, categories })
  }

  const removeVisibleImage = async (src: string) => {
    const rawSrc = stripBase(src)
    if (extraImages.includes(src) || extraImages.includes(rawSrc)) {
      await removeGalleryImage(product.id, extraImages.includes(src) ? src : rawSrc)
      onMessage('Se quitó una imagen de presentación.')
      return
    }
    if (images[product.id] === src || images[product.id] === rawSrc) {
      await restoreProductImage(product.id)
      onMessage('Se restauró la imagen principal original.')
      return
    }
    if (product.gallery.length <= 1) {
      onMessage('Deja al menos una imagen de presentación.')
      return
    }
    updateProduct(product.id, {
      gallery: product.gallery.filter((item) => item !== src && item !== rawSrc),
    })
    onMessage('Se quitó una imagen de la ficha.')
  }

  return (
    <article className="rounded-[1.3rem] border border-pink-soft p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <img
          src={resolved.image}
          alt=""
          className="h-14 w-14 shrink-0 rounded-xl border border-pink-soft bg-surface object-contain p-1"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-plum">{product.name}</h3>
            <span className="text-xs text-ink/50">{stockLabel(product.stock)}</span>
          </div>
          <p className="truncate text-sm text-ink/60">
            {product.presentation}
            {product.flavor ? ` · ${product.flavor}` : ''} · {product.category}
          </p>
          <p className="text-sm font-semibold text-magenta">{formatPrice(product.price)}</p>
        </div>
        <Button
          variant="secondary"
          className="shrink-0 px-3"
          disabled={busy}
          icon={<ImagePlus size={16} />}
          onClick={() => coverInput.current?.click()}
        >
          Foto
        </Button>
        <Button
          variant={editing ? 'secondary' : 'primary'}
          className="shrink-0 px-4"
          icon={editing ? undefined : <Pencil size={16} />}
          onClick={onToggle}
        >
          {editing ? 'Cerrar' : 'Editar'}
        </Button>
      </div>

      <input
        ref={coverInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={async (event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (!file) {
            return
          }
          setBusy(true)
          const error = await replaceProductImage(product.id, file)
          setBusy(false)
          onMessage(error ?? `Imagen principal actualizada: ${product.name}`)
        }}
      />
      <input
        ref={galleryInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={async (event) => {
          const files = Array.from(event.target.files ?? [])
          event.target.value = ''
          if (files.length === 0) {
            return
          }
          setBusy(true)
          let lastError: string | null = null
          for (const file of files) {
            lastError = await addGalleryImage(product.id, file)
            if (lastError) {
              break
            }
          }
          setBusy(false)
          onMessage(lastError ?? `Imágenes de presentación agregadas a ${product.name}`)
        }}
      />

      {editing && (
        <>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-magenta">
          Imágenes de presentación
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {resolved.gallery.map((src) => (
            <div key={src} className="relative h-20 w-20 shrink-0">
              <img
                src={src}
                alt=""
                className="h-20 w-20 rounded-xl border border-pink-soft bg-surface object-contain p-1"
              />
              <button
                type="button"
                aria-label="Quitar imagen"
                onClick={() => void removeVisibleImage(src)}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-plum text-white"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button className="px-4" disabled={busy} onClick={() => coverInput.current?.click()}>
            {busy ? 'Guardando…' : 'Cambiar imagen principal'}
          </Button>
          <Button
            variant="secondary"
            className="px-4"
            disabled={busy}
            icon={<ImagePlus size={16} />}
            onClick={() => galleryInput.current?.click()}
          >
            Agregar imágenes
          </Button>
          {images[product.id] && (
            <Button
              variant="ghost"
              className="px-4"
              onClick={async () => {
                await restoreProductImage(product.id)
                onMessage(`Se restauró la imagen original de ${product.name}`)
              }}
            >
              Restaurar principal
            </Button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-plum">
          Nombre
          <input
            value={product.name}
            onChange={(event) => updateProduct(product.id, { name: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="text-xs font-medium text-plum">
          Presentación
          <input
            value={product.presentation}
            onChange={(event) => updateProduct(product.id, { presentation: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="text-xs font-medium text-plum">
          Sabor
          <input
            value={product.flavor ?? ''}
            onChange={(event) =>
              updateProduct(product.id, { flavor: event.target.value || undefined })
            }
            className={fieldClass}
          />
        </label>
        <label className="text-xs font-medium text-plum">
          Sección principal
          <select
            value={product.category}
            onChange={(event) => setCategory(event.target.value)}
            className={fieldClass}
          >
            {PRODUCT_SECTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-plum">
          Precio actual
          <input
            type="number"
            min="0"
            step="0.01"
            value={product.price}
            onChange={(event) => updateProduct(product.id, { price: Number(event.target.value) })}
            className={fieldClass}
          />
        </label>
        <label className="text-xs font-medium text-plum">
          Precio sin descuento
          <input
            type="number"
            min="0"
            step="0.01"
            value={product.oldPrice ?? ''}
            onChange={(event) =>
              updateProduct(product.id, {
                oldPrice: event.target.value === '' ? null : Number(event.target.value),
              })
            }
            className={fieldClass}
          />
        </label>
        <label className="text-xs font-medium text-plum">
          Stock
          <input
            type="number"
            min="0"
            step="1"
            value={product.stock}
            onChange={(event) => updateProduct(product.id, { stock: Number(event.target.value) })}
            className={fieldClass}
          />
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="text-xs font-medium text-plum">También aparece en</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRODUCT_SECTIONS.map((item) => {
            const checked = product.categories.includes(item) || product.category === item
            return (
              <label
                key={item}
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium ${
                  checked ? 'bg-magenta text-white' : 'bg-surface text-plum'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggleSection(item)}
                />
                {item}
              </label>
            )
          })}
        </div>
      </fieldset>

      <label className="mt-4 block text-xs font-medium text-plum">
        Descripción corta
        <textarea
          value={product.shortDescription}
          onChange={(event) =>
            updateProduct(product.id, { shortDescription: event.target.value })
          }
          className={areaClass}
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-plum">
        Descripción de la ficha
        <textarea
          value={product.description}
          onChange={(event) => updateProduct(product.id, { description: event.target.value })}
          className={`${areaClass} min-h-32`}
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-plum">
        Etiquetas (una por línea)
        <textarea
          value={featuresText}
          onChange={(event) => setFeaturesText(event.target.value)}
          onBlur={() => updateProduct(product.id, { features: linesToList(featuresText) })}
          className={areaClass}
        />
      </label>
      <label className="mt-3 block text-xs font-medium text-plum">
        Información del producto (una por línea)
        <textarea
          value={detailsText}
          onChange={(event) => setDetailsText(event.target.value)}
          onBlur={() => updateProduct(product.id, { details: linesToList(detailsText) })}
          className={areaClass}
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-plum">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={product.isNew}
            onChange={(event) => updateProduct(product.id, { isNew: event.target.checked })}
          />
          Marcar como nuevo
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={product.featured}
            onChange={(event) => updateProduct(product.id, { featured: event.target.checked })}
          />
          Destacado
        </label>
      </div>
        </>
      )}
    </article>
  )
}
