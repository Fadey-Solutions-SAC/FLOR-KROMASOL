import {
  ADMIN_ALLOWED_IMAGE_TYPES,
  ADMIN_IMAGES_DB,
  ADMIN_IMAGES_STORE,
  ADMIN_MAX_IMAGE_BYTES,
} from '../config/admin'

export type CatalogImageMap = Record<number, string>

function openImageDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(ADMIN_IMAGES_DB, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(ADMIN_IMAGES_STORE)) {
        db.createObjectStore(ADMIN_IMAGES_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function loadCatalogImages(): Promise<CatalogImageMap> {
  const db = await openImageDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ADMIN_IMAGES_STORE, 'readonly')
    const store = tx.objectStore(ADMIN_IMAGES_STORE)
    const request = store.getAllKeys()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const keys = request.result as IDBValidKey[]
      const values = store.getAll()
      values.onerror = () => reject(values.error)
      values.onsuccess = () => {
        const map: CatalogImageMap = {}
        keys.forEach((key, index) => {
          if (typeof key === 'number' && typeof values.result[index] === 'string') {
            map[key] = values.result[index]
          }
        })
        resolve(map)
      }
    }
  })
}

export async function saveCatalogImage(productId: number, dataUrl: string) {
  const db = await openImageDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(ADMIN_IMAGES_STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(ADMIN_IMAGES_STORE).put(dataUrl, productId)
  })
}

export async function deleteCatalogImage(productId: number) {
  const db = await openImageDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(ADMIN_IMAGES_STORE, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(ADMIN_IMAGES_STORE).delete(productId)
  })
}

export function isAllowedImageFile(file: File): boolean {
  if (file.size > ADMIN_MAX_IMAGE_BYTES) {
    return false
  }

  return (ADMIN_ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)
}

export async function compressCatalogImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const maxSize = 1100
  const ratio = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * ratio))
  const height = Math.max(1, Math.round(bitmap.height * ratio))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('No se pudo procesar la imagen')
  }
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.84)
}
