import {
  isWhatsAppConfigured,
  WHATSAPP_NUMBER,
} from '../config/store'
import type { CartItem, Product } from '../types'
import { formatPrice, getCartSubtotal, getCartTotal } from './format'

export function generateWhatsAppMessage(cart: CartItem[], notes: string): string {
  const lines = [
    'Hola 👋',
    '',
    'Quiero realizar el siguiente pedido:',
    '',
    '🛍️ *PEDIDO ANDROMEDA*',
    '',
    '━━━━━━━━━━━━━━',
    '',
  ]

  cart.forEach((item, index) => {
    lines.push(`• ${item.name} ${item.presentation}`)
    lines.push(`  Cantidad: ${item.quantity}`)
    lines.push(`  Precio: ${formatPrice(item.price)}`)
    lines.push(`  Subtotal: ${formatPrice(getCartSubtotal(item))}`)
    if (index < cart.length - 1) {
      lines.push('')
    }
  })

  lines.push('')
  lines.push('━━━━━━━━━━━━━━')
  lines.push('')
  lines.push(`💰 *TOTAL: ${formatPrice(getCartTotal(cart))}*`)

  const trimmedNotes = notes.trim()
  if (trimmedNotes) {
    lines.push('')
    lines.push('📝 Observaciones:')
    lines.push(trimmedNotes)
  }

  lines.push('')
  lines.push('Gracias.')

  return lines.join('\n')
}

export function generateReservationMessage(product: Product): string {
  return [
    'Hola 👋',
    '',
    'Quisiera *reservar para la próxima* este producto:',
    '',
    `• ${product.name} ${product.presentation}`,
    `  Precio de referencia: ${formatPrice(product.price)}`,
    '',
    'Avísame cuando vuelva a haber stock, por favor.',
    '',
    'Gracias.',
  ].join('\n')
}

export function getWhatsAppDigits(number = WHATSAPP_NUMBER): string {
  return number.replace(/\D/g, '')
}

export function buildWhatsAppUrl(message: string, number = WHATSAPP_NUMBER): string | null {
  if (!isWhatsAppConfigured(number) || !message.trim()) {
    return null
  }

  const phone = getWhatsAppDigits(number)
  const encoded = encodeURIComponent(message)

  return `https://api.whatsapp.com/send/?phone=${phone}&text=${encoded}&type=phone_number&app_absent=0`
}

export function openWhatsApp(message: string, number = WHATSAPP_NUMBER): boolean {
  const url = buildWhatsAppUrl(message, number)
  if (!url) {
    return false
  }

  window.open(url, '_blank', 'noopener,noreferrer')
  return true
}
