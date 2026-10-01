import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  ADMIN_MAX_CREDENTIAL_LENGTH,
  ADMIN_MAX_GALLERY_IMAGES,
  ADMIN_MIN_AUTH_DELAY_MS,
  ADMIN_TAP_COUNT,
  ADMIN_TAP_WINDOW_MS,
} from '../config/admin'
import {
  clearAdminLock,
  clearAdminSession,
  createAdminSession,
  getAdminLockRemaining,
  hasAdminSession,
  isAdminLocked,
  registerAdminFailure,
} from '../utils/adminGuard'
import { verifyAdminCredentials, waitAtLeast } from '../utils/crypto'
import {
  compressCatalogImage,
  deleteCatalogImage,
  isAllowedImageFile,
  loadCatalogGalleries,
  loadCatalogImages,
  saveCatalogGallery,
  saveCatalogImage,
  type CatalogGalleryMap,
  type CatalogImageMap,
} from '../utils/catalogImages'
import { setCatalogGalleryOverrides, setCatalogImageOverrides } from '../utils/productMedia'

type AdminContextValue = {
  loginOpen: boolean
  panelOpen: boolean
  authenticated: boolean
  authError: string | null
  authBusy: boolean
  images: CatalogImageMap
  galleries: CatalogGalleryMap
  openLoginFromSecret: () => void
  closeLogin: () => void
  closePanel: () => void
  login: (username: string, password: string, honeypot: string) => Promise<boolean>
  logout: () => void
  replaceProductImage: (productId: number, file: File) => Promise<string | null>
  restoreProductImage: (productId: number) => Promise<void>
  addGalleryImage: (productId: number, file: File) => Promise<string | null>
  removeGalleryImage: (productId: number, src: string) => Promise<void>
  handleSecretTaps: (event: React.MouseEvent | React.PointerEvent) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(() => hasAdminSession())
  const [authError, setAuthError] = useState<string | null>(null)
  const [authBusy, setAuthBusy] = useState(false)
  const [images, setImages] = useState<CatalogImageMap>({})
  const [galleries, setGalleries] = useState<CatalogGalleryMap>({})
  const tapsRef = useRef({ count: 0, last: 0 })

  useEffect(() => {
    let active = true
    Promise.all([loadCatalogImages(), loadCatalogGalleries()])
      .then(([imageMap, galleryMap]) => {
        if (!active) {
          return
        }
        setImages(imageMap)
        setGalleries(galleryMap)
        setCatalogImageOverrides(imageMap)
        setCatalogGalleryOverrides(galleryMap)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    setCatalogImageOverrides(images)
  }, [images])

  useEffect(() => {
    setCatalogGalleryOverrides(galleries)
  }, [galleries])

  const openLoginFromSecret = useCallback(() => {
    if (hasAdminSession()) {
      setAuthenticated(true)
      setPanelOpen(true)
      setLoginOpen(false)
      return
    }
    setAuthError(
      isAdminLocked()
        ? `Acceso bloqueado. Intenta en ${Math.ceil(getAdminLockRemaining() / 60000)} min.`
        : null,
    )
    setLoginOpen(true)
  }, [])

  const handleSecretTaps = useCallback(
    (event: React.MouseEvent | React.PointerEvent) => {
      const now = Date.now()
      if (now - tapsRef.current.last > ADMIN_TAP_WINDOW_MS) {
        tapsRef.current.count = 0
      }
      tapsRef.current.count += 1
      tapsRef.current.last = now

      if (tapsRef.current.count >= ADMIN_TAP_COUNT) {
        event.preventDefault()
        event.stopPropagation()
        tapsRef.current.count = 0
        openLoginFromSecret()
      }
    },
    [openLoginFromSecret],
  )

  const login = useCallback(async (username: string, password: string, honeypot: string) => {
    const startedAt = Date.now()
    setAuthBusy(true)
    setAuthError(null)

    if (isAdminLocked()) {
      await waitAtLeast(startedAt, ADMIN_MIN_AUTH_DELAY_MS)
      setAuthError(
        `Demasiados intentos. Espera ${Math.ceil(getAdminLockRemaining() / 60000)} min.`,
      )
      setAuthBusy(false)
      return false
    }

    const user = username.trim()
    const pass = password
    const invalidShape =
      honeypot.length > 0 ||
      user.length === 0 ||
      pass.length === 0 ||
      user.length > ADMIN_MAX_CREDENTIAL_LENGTH ||
      pass.length > ADMIN_MAX_CREDENTIAL_LENGTH ||
      /[\u0000-\u001F]/.test(user) ||
      /[\u0000-\u001F]/.test(pass)

    const matched = invalidShape ? false : await verifyAdminCredentials(user, pass)
    await waitAtLeast(startedAt, ADMIN_MIN_AUTH_DELAY_MS)

    if (!matched) {
      const lockedFor = registerAdminFailure()
      setAuthError(
        lockedFor > 0
          ? `Acceso bloqueado. Espera ${Math.ceil(lockedFor / 60000)} min.`
          : 'Usuario o contraseña incorrectos.',
      )
      setAuthBusy(false)
      return false
    }

    clearAdminLock()
    createAdminSession()
    setAuthenticated(true)
    setLoginOpen(false)
    setPanelOpen(true)
    setAuthBusy(false)
    return true
  }, [])

  const logout = useCallback(() => {
    clearAdminSession()
    setAuthenticated(false)
    setPanelOpen(false)
    setLoginOpen(false)
  }, [])

  const replaceProductImage = useCallback(async (productId: number, file: File) => {
    if (!hasAdminSession()) {
      return 'Sesión expirada. Vuelve a ingresar.'
    }
    if (!isAllowedImageFile(file)) {
      return 'Solo se aceptan JPG, PNG o WEBP de hasta 8 MB.'
    }

    try {
      const dataUrl = await compressCatalogImage(file)
      await saveCatalogImage(productId, dataUrl)
      setImages((current) => ({ ...current, [productId]: dataUrl }))
      return null
    } catch {
      return 'No se pudo guardar la imagen. Intenta con otro archivo.'
    }
  }, [])

  const restoreProductImage = useCallback(async (productId: number) => {
    if (!hasAdminSession()) {
      return
    }
    await deleteCatalogImage(productId)
    setImages((current) => {
      const next = { ...current }
      delete next[productId]
      return next
    })
  }, [])

  const addGalleryImage = useCallback(async (productId: number, file: File) => {
    if (!hasAdminSession()) {
      return 'Sesión expirada. Vuelve a ingresar.'
    }
    if (!isAllowedImageFile(file)) {
      return 'Solo se aceptan JPG, PNG o WEBP de hasta 8 MB.'
    }

    const current = galleries[productId] ?? []
    if (current.length >= ADMIN_MAX_GALLERY_IMAGES) {
      return `Puedes agregar hasta ${ADMIN_MAX_GALLERY_IMAGES} imágenes extra de presentación.`
    }

    try {
      const dataUrl = await compressCatalogImage(file)
      const next = [...current, dataUrl]
      await saveCatalogGallery(productId, next)
      setGalleries((map) => ({ ...map, [productId]: next }))
      return null
    } catch {
      return 'No se pudo guardar la imagen. Intenta con otro archivo.'
    }
  }, [galleries])

  const removeGalleryImage = useCallback(async (productId: number, src: string) => {
    if (!hasAdminSession()) {
      return
    }
    const next = (galleries[productId] ?? []).filter((item) => item !== src)
    await saveCatalogGallery(productId, next)
    setGalleries((map) => ({ ...map, [productId]: next }))
  }, [galleries])

  const value = useMemo<AdminContextValue>(
    () => ({
      loginOpen,
      panelOpen,
      authenticated,
      authError,
      authBusy,
      images,
      galleries,
      openLoginFromSecret,
      closeLogin: () => setLoginOpen(false),
      closePanel: () => setPanelOpen(false),
      login,
      logout,
      replaceProductImage,
      restoreProductImage,
      addGalleryImage,
      removeGalleryImage,
      handleSecretTaps,
    }),
    [
      addGalleryImage,
      authBusy,
      authError,
      authenticated,
      galleries,
      handleSecretTaps,
      images,
      login,
      loginOpen,
      logout,
      openLoginFromSecret,
      panelOpen,
      removeGalleryImage,
      replaceProductImage,
      restoreProductImage,
    ],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin debe usarse dentro de AdminProvider')
  }
  return context
}
