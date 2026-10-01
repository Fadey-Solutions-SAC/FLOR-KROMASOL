import { WhatsAppIcon } from './icons/WhatsAppIcon'
import { useStoreUi } from '../context/StoreUiContext'

export function WhatsAppButton() {
  const { handleWhatsAppInfo } = useStoreUi()

  return (
    <button
      type="button"
      onClick={handleWhatsAppInfo}
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_24px_rgba(37,211,102,0.35)] transition duration-200 hover:scale-105 hover:bg-whatsapp-dark"
    >
      <WhatsAppIcon size={26} />
    </button>
  )
}
