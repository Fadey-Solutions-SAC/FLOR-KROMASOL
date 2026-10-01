import { X } from 'lucide-react'
import { Button } from './ui/Button'

type ConfigDialogProps = {
  open: boolean
  onClose: () => void
}

export function ConfigDialog({ open, onClose }: ConfigDialogProps) {
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
        aria-labelledby="config-title"
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
        <h2 id="config-title" className="font-display text-2xl font-bold text-plum">
          WhatsApp aún no está configurado
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          Para recibir pedidos, agrega tu número en el archivo
          <code className="mx-1 rounded bg-surface px-1.5 py-0.5 text-magenta">
            src/config/store.ts
          </code>
          dentro de la variable <strong>WHATSAPP_NUMBER</strong>, con código de
          país y sin espacios. Ejemplo Perú: 51987654321.
        </p>
        <Button className="mt-5" onClick={onClose}>
          Entendido
        </Button>
      </div>
    </div>
  )
}
