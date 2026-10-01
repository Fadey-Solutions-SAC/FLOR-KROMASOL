import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CATEGORIES, PRODUCT_SECTIONS } from '../../data/categories'
import { Button } from '../ui/Button'
import { useAdmin } from '../../context/AdminContext'
import { useCatalog } from '../../context/CatalogContext'
import { linesToList } from '../../utils/catalogStore'
import { AdminProductEditor } from './AdminProductEditor'

export function AdminPanel() {
  const { panelOpen, closePanel, logout } = useAdmin()
  const { products, addProduct } = useCatalog()
  const [section, setSection] = useState<(typeof CATEGORIES)[number]>('Todos')
  const [message, setMessage] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPresentation, setNewPresentation] = useState('')
  const [newFlavor, setNewFlavor] = useState('')
  const [newPrice, setNewPrice] = useState('169.90')
  const [newOldPrice, setNewOldPrice] = useState('')
  const [newStock, setNewStock] = useState('1')
  const [newDescription, setNewDescription] = useState('')
  const [newLongDescription, setNewLongDescription] = useState('')
  const [newFeatures, setNewFeatures] = useState('')
  const [newDetails, setNewDetails] = useState('')
  const [newSection, setNewSection] = useState<(typeof PRODUCT_SECTIONS)[number]>('Suplementos')

  if (!panelOpen) {
    return null
  }

  const visibleProducts = products.filter(
    (product) =>
      section === 'Todos' ||
      product.categories.includes(section) ||
      product.category === section,
  )
  const newCategory = section === 'Todos' ? newSection : section

  const resetNewProduct = () => {
    setAdding(false)
    setNewName('')
    setNewPresentation('')
    setNewFlavor('')
    setNewPrice('169.90')
    setNewOldPrice('')
    setNewStock('1')
    setNewDescription('')
    setNewLongDescription('')
    setNewFeatures('')
    setNewDetails('')
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-plum/50"
        aria-label="Cerrar panel"
        onClick={closePanel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-panel-title"
        className="animate-fade-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-[1.8rem] bg-white p-5 shadow-2xl sm:max-w-4xl sm:rounded-[1.8rem]"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="admin-panel-title" className="font-display text-2xl font-bold text-plum">
              Administrar catálogo
            </h2>
            <p className="mt-1 text-sm text-ink/65">
              Edita toda la ficha del producto: textos, precios, stock e imágenes de presentación.
            </p>
          </div>
          <button
            type="button"
            onClick={closePanel}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-plum"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSection(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                item === section ? 'bg-magenta text-white' : 'bg-surface text-plum'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {message && (
          <p className="mb-4 rounded-2xl bg-surface px-4 py-3 text-sm text-plum" role="status">
            {message}
          </p>
        )}

        <div className="mb-4 rounded-[1.3rem] border border-dashed border-pink-soft p-4">
          {adding ? (
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault()
                const created = addProduct({
                  name: newName,
                  presentation: newPresentation,
                  flavor: newFlavor,
                  category: newCategory,
                  price: Number(newPrice),
                  oldPrice: newOldPrice ? Number(newOldPrice) : null,
                  stock: Number(newStock),
                  shortDescription: newDescription,
                  description: newLongDescription,
                  features: linesToList(newFeatures),
                  details: linesToList(newDetails),
                })
                if (!created) {
                  setMessage('Revisa nombre, precio y stock para agregar el producto.')
                  return
                }
                resetNewProduct()
                setMessage(`Producto agregado en ${newCategory}: ${created.name}`)
              }}
            >
              <p className="font-semibold text-plum sm:col-span-2">
                Nuevo producto en {newCategory}
              </p>
              <label className="text-sm text-plum">
                Nombre
                <input
                  required
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Presentación
                <input
                  value={newPresentation}
                  onChange={(event) => setNewPresentation(event.target.value)}
                  placeholder="630 g"
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Sabor
                <input
                  value={newFlavor}
                  onChange={(event) => setNewFlavor(event.target.value)}
                  placeholder="Fresas con crema"
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Precio actual
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(event) => setNewPrice(event.target.value)}
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Precio sin descuento
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newOldPrice}
                  onChange={(event) => setNewOldPrice(event.target.value)}
                  placeholder="Opcional"
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Stock
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={newStock}
                  onChange={(event) => setNewStock(event.target.value)}
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              {section === 'Todos' && (
                <label className="text-sm text-plum">
                  Sección
                  <select
                    value={newSection}
                    onChange={(event) =>
                      setNewSection(event.target.value as (typeof PRODUCT_SECTIONS)[number])
                    }
                    className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                  >
                    {PRODUCT_SECTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className="text-sm text-plum sm:col-span-2">
                Descripción corta
                <input
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  className="mt-1 h-11 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm"
                />
              </label>
              <label className="text-sm text-plum sm:col-span-2">
                Descripción de la ficha
                <textarea
                  value={newLongDescription}
                  onChange={(event) => setNewLongDescription(event.target.value)}
                  className="mt-1 min-h-24 w-full rounded-2xl border border-pink-soft bg-surface px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Etiquetas (una por línea)
                <textarea
                  value={newFeatures}
                  onChange={(event) => setNewFeatures(event.target.value)}
                  placeholder="Vitaminas"
                  className="mt-1 min-h-24 w-full rounded-2xl border border-pink-soft bg-surface px-4 py-3 text-sm"
                />
              </label>
              <label className="text-sm text-plum">
                Información del producto (una por línea)
                <textarea
                  value={newDetails}
                  onChange={(event) => setNewDetails(event.target.value)}
                  className="mt-1 min-h-24 w-full rounded-2xl border border-pink-soft bg-surface px-4 py-3 text-sm"
                />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">Guardar producto</Button>
                <Button variant="secondary" type="button" onClick={resetNewProduct}>
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <Button icon={<Plus size={16} />} onClick={() => setAdding(true)}>
              Agregar producto {section === 'Todos' ? '' : `a ${section}`}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {visibleProducts.length === 0 && (
            <p className="rounded-2xl bg-surface px-4 py-8 text-center text-sm text-ink/60">
              No hay productos en esta sección todavía.
            </p>
          )}
          {visibleProducts.map((product) => (
            <AdminProductEditor
              key={product.id}
              product={product}
              onMessage={setMessage}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={closePanel}>
            Cerrar
          </Button>
          <Button variant="ghost" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  )
}
