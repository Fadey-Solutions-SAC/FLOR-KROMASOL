import { WhatsAppIcon } from './icons/WhatsAppIcon'
import { Button } from './ui/Button'
import { useStoreUi } from '../context/StoreUiContext'
import type { Product } from '../types'

type ReserveButtonProps = {
  product: Product
  className?: string
}

export function ReserveButton({ product, className = '' }: ReserveButtonProps) {
  const { handleReserve } = useStoreUi()

  return (
    <Button
      variant="whatsapp"
      className={className}
      icon={<WhatsAppIcon />}
      onClick={() => handleReserve(product)}
    >
      Reservar para la próxima
    </Button>
  )
}
