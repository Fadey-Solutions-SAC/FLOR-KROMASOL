import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { useCart } from '../hooks/useCart'
import { WhatsAppIcon } from './icons/WhatsAppIcon'

type OrderReadyDialogProps = {
  open: boolean
  onClose: () => void
}

export function OrderReadyDialog({ open, onClose }: OrderReadyDialogProps) {
  const { clearCart } = useCart()

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-plum/45"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-ready-title"
        className="animate-fade-up relative w-full max-w-md rounded-[1.6rem] bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface"
        >
          <X size={16} />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
          <WhatsAppIcon size={22} />
        </div>
        <h2 id="order-ready-title" className="font-display text-2xl font-bold text-plum">
          Tu pedido está listo para enviarse por WhatsApp.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Abre la conversación y envía el mensaje para que podamos confirmarte
          disponibilidad y entrega. La confirmación real la haremos por WhatsApp.
        </p>
        <p className="mt-4 text-sm font-medium text-plum">¿Deseas vaciar el carrito?</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              clearCart()
              onClose()
            }}
          >
            Sí, vaciar carrito
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Conservar productos
          </Button>
        </div>
      </div>
    </div>
  )
}
