import { WhatsAppIcon } from './icons/WhatsAppIcon'
import {
  FACEBOOK_URL,
  INDEPENDENT_DISCLAIMER,
  INSTAGRAM_URL,
  PRICE_DISCLAIMER,
  STORE_FULL_NAME,
  TIKTOK_URL,
} from '../config/store'
import { Logo } from './Logo'
import { Button } from './ui/Button'
import { useStoreUi } from '../context/StoreUiContext'
import { useAdmin } from '../context/AdminContext'
import { withBase } from '../utils/baseUrl'

const LINKS = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Catálogo', href: '/#catalogo' },
  { label: 'Beneficios', href: '/#beneficios' },
  { label: 'Cómo comprar', href: '/#como-comprar' },
  { label: 'Contacto', href: '/#contacto' },
]

function SocialIcon({
  name,
  size = 16,
}: {
  name: 'facebook' | 'instagram' | 'tiktok'
  size?: number
}) {
  if (name === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className="fill-current" aria-hidden="true">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4V10c0-.6.4-1 1-1Z" />
      </svg>
    )
  }

  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className="fill-current" aria-hidden="true">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5Zm6.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1ZM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="fill-current" aria-hidden="true">
      <path d="M14.8 3h2.3c.2 1.9 1.4 3.5 3.2 4.2v2.4c-1.2 0-2.3-.4-3.2-1v6.8c0 3.4-2.8 6.2-6.3 6.2S4.5 18.8 4.5 15.4 7.3 9.2 10.8 9.2c.4 0 .7 0 1.1.1v2.5c-.3-.1-.7-.2-1.1-.2-2.1 0-3.8 1.7-3.8 3.8s1.7 3.8 3.8 3.8 3.8-1.7 3.8-3.8V3Z" />
    </svg>
  )
}

export function Footer() {
  const { handleWhatsAppInfo } = useStoreUi()
  const { handleSecretTaps } = useAdmin()
  const socials = [
    { href: FACEBOOK_URL, label: 'Facebook', name: 'facebook' as const },
    { href: INSTAGRAM_URL, label: 'Instagram', name: 'instagram' as const },
    { href: TIKTOK_URL, label: 'TikTok', name: 'tiktok' as const },
  ].filter((item) => item.href)

  return (
    <footer className="bg-plum text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div
            className="select-none rounded-2xl bg-white/95 p-3"
            onClick={handleSecretTaps}
          >
            <Logo asLink={false} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {STORE_FULL_NAME}. Catálogo de productos para armar tu pedido de forma
            rápida y personalizada.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">Catálogo de productos</h2>
          <nav className="mt-4 flex flex-col gap-2" aria-label="Pie de página">
            {LINKS.map((link) => (
              <a key={link.href} href={withBase(link.href)} className="text-sm text-white/75 hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold">¿Tienes alguna consulta?</h2>
          <p className="mt-3 text-sm text-white/75">
            Atención personalizada para ayudarte con tu pedido.
          </p>
          <Button
            variant="whatsapp"
            className="mt-4"
            icon={<WhatsAppIcon />}
            onClick={handleWhatsAppInfo}
          >
            WhatsApp
          </Button>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs leading-relaxed text-white/60">
        <p>{PRICE_DISCLAIMER}</p>
        <p className="mt-2">{INDEPENDENT_DISCLAIMER}</p>
      </div>
    </footer>
  )
}
