import { Clock3, MapPin } from 'lucide-react'
import {
  CONTACT_HOURS,
  DELIVERY_ZONE,
  WHATSAPP_CONTACT_MESSAGE,
  isWhatsAppConfigured,
} from '../config/store'
import { Button } from './ui/Button'
import { useStoreUi } from '../context/StoreUiContext'
import { openWhatsApp } from '../utils/whatsapp'
import { WhatsAppIcon } from './icons/WhatsAppIcon'

export function Contact() {
  const { openConfig } = useStoreUi()

  const handleContact = () => {
    if (!isWhatsAppConfigured()) {
      openConfig()
      return
    }
    openWhatsApp(WHATSAPP_CONTACT_MESSAGE)
  }

  return (
    <section id="contacto" className="scroll-mt-24 bg-surface py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-3xl font-bold text-plum">
            ¿Quieres realizar un pedido?
          </h2>
          <p className="mt-4 max-w-xl text-ink/70">
            Escríbenos por WhatsApp y te ayudaremos con tu pedido, disponibilidad
            y coordinación de entrega.
          </p>
          <div className="mt-6">
          <Button
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            onClick={handleContact}
          >
            Hablar por WhatsApp
          </Button>
          </div>
        </div>
        <div className="space-y-3">
          <article className="rounded-[1.3rem] bg-white p-5">
            <div className="flex items-start gap-3">
              <Clock3 className="text-magenta" size={20} />
              <div>
                <h3 className="font-semibold text-plum">Horario de atención</h3>
                <p className="mt-1 text-sm text-ink/65">{CONTACT_HOURS}</p>
              </div>
            </div>
          </article>
          <article className="rounded-[1.3rem] bg-white p-5">
            <div className="flex items-start gap-3">
              <MapPin className="text-magenta" size={20} />
              <div>
                <h3 className="font-semibold text-plum">Zona de atención</h3>
                <p className="mt-1 text-sm text-ink/65">{DELIVERY_ZONE}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
