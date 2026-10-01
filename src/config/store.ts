/**
 * Configuración central de la tienda.
 * Cambia estos valores en un solo lugar para actualizar toda la web.
 *
 * Esta página es un catálogo personal de una vendedora independiente.
 * No es el sitio web oficial de Kromasol.
 */

export const STORE_NAME = 'Andromeda'
export const STORE_BRAND_LINE = 'by Kromasol'
export const STORE_FULL_NAME = `${STORE_NAME} ${STORE_BRAND_LINE}`
export const STORE_DESCRIPTION =
  'Conoce nuestro catálogo de productos Andromeda by Kromasol. Consulta precios, arma tu pedido y compra fácilmente por WhatsApp.'

export const SEO_TITLE = 'Andromeda by Kromasol | Productos para tu bienestar'
export const SEO_DESCRIPTION = STORE_DESCRIPTION

/** WhatsApp Business. Código de país + número, solo dígitos. Perú: 51 + 975697019 */
export const WHATSAPP_NUMBER = '51975697019'

export const CONTACT_HOURS = 'Lunes a sábado, 9:00 a.m. a 8:00 p.m.'
export const DELIVERY_ZONE = 'Tingo, Luya, Amazonas'

/** Deja vacío para ocultar el botón de esa red. */
export const INSTAGRAM_URL = ''
export const FACEBOOK_URL = ''
export const TIKTOK_URL = ''

export const CURRENCY = 'PEN'
export const CURRENCY_SYMBOL = 'S/'
export const LOCALE = 'es-PE'

export const CART_STORAGE_KEY = 'andromeda-cart-v1'

export const SITE_URL = ''

export const IMPORTANT_NOTICE =
  'Los productos deben consumirse de acuerdo con las indicaciones del envase y/o la información proporcionada por el fabricante.'

export const PRICE_DISCLAIMER =
  'Los precios, disponibilidad y promociones pueden variar.'

export const INDEPENDENT_DISCLAIMER =
  'Catálogo personal de una vendedora independiente. Esta página no es el sitio web oficial de Kromasol.'

export const WHATSAPP_INFO_MESSAGE =
  'Hola, quisiera información sobre los productos Andromeda.'

export const WHATSAPP_CONTACT_MESSAGE =
  'Hola, quisiera realizar un pedido y consultar disponibilidad y entrega.'

export function isWhatsAppConfigured(number = WHATSAPP_NUMBER): boolean {
  const digits = number.replace(/\D/g, '')
  return digits.length >= 11 && !/[xX]/.test(number)
}
