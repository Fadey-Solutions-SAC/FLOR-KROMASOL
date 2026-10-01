import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Product } from '../types'

type ProductGalleryProps = {
  product: Product
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(product.gallery[0] ?? product.image)
  const [viewerOpen, setViewerOpen] = useState(false)

  useEffect(() => {
    setActiveImage(product.gallery[0] ?? product.image)
  }, [product])

  useEffect(() => {
    if (!viewerOpen) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setViewerOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [viewerOpen])

  const currentImage = activeImage || product.image

  return (
    <div>
      <button
        type="button"
        className="w-full rounded-[1.6rem] bg-surface p-5"
        onClick={() => setViewerOpen(true)}
        aria-label={`Ver imagen grande de ${product.name}`}
      >
        <img
          src={currentImage}
          alt={`${product.name} ${product.presentation}`}
          className="aspect-square w-full object-contain"
        />
      </button>
      {product.gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {product.gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              aria-label={`Ver imagen ${index + 1} de ${product.name}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border ${
                currentImage === image ? 'border-magenta' : 'border-transparent'
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {viewerOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-plum/80 p-4">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Cerrar imagen"
            onClick={() => setViewerOpen(false)}
          />
          <button
            type="button"
            onClick={() => setViewerOpen(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-plum"
          >
            <X size={18} />
          </button>
          <img
            src={currentImage}
            alt={`${product.name} ${product.presentation}`}
            className="relative z-10 max-h-[88vh] max-w-full rounded-3xl object-contain"
          />
        </div>
      )}
    </div>
  )
}
