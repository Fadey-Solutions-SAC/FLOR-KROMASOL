/** Protección del panel: no guardar usuario ni contraseña en texto plano. */

export const ADMIN_PBKDF2_ITERATIONS = 120_000
export const ADMIN_SALT_PREFIX = 'andromeda.catalog.admin.v1|'
export const ADMIN_PASSWORD_HASH =
  'be75160dace9a79b104ddc2205a38427ef2fae2c0c6aa7be8cfda45e2674c8bc'

export const ADMIN_MAX_ATTEMPTS = 4
export const ADMIN_LOCKOUT_MS = 15 * 60 * 1000
export const ADMIN_SESSION_MS = 30 * 60 * 1000
export const ADMIN_MAX_CREDENTIAL_LENGTH = 64
export const ADMIN_MIN_AUTH_DELAY_MS = 650
export const ADMIN_TAP_COUNT = 3
export const ADMIN_TAP_WINDOW_MS = 800

export const ADMIN_LOCK_KEY = 'andromeda-admin-lock-v1'
export const ADMIN_SESSION_KEY = 'andromeda-admin-session-v1'
export const ADMIN_IMAGES_DB = 'andromeda-catalog-images'
export const ADMIN_IMAGES_STORE = 'product-images'
export const ADMIN_GALLERIES_STORE = 'product-galleries'
export const ADMIN_MAX_GALLERY_IMAGES = 10

export const ADMIN_ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const ADMIN_MAX_IMAGE_BYTES = 8 * 1024 * 1024
