import { Button } from './ui/Button'
import { BerryMotif } from './decor/BerryMotif'
import { useStoreUi } from '../context/StoreUiContext'
import { WhatsAppIcon } from './icons/WhatsAppIcon'

export function Hero() {
  const { handleWhatsAppInfo } = useStoreUi()

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#FDF6FA_48%,#fff_100%)]"
    >
      <BerryMotif className="pointer-events-none absolute -left-8 top-10 w-48 opacity-80" />
      <BerryMotif className="pointer-events-none absolute -right-10 bottom-0 w-56 rotate-12 opacity-70" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="animate-fade-up relative z-10 max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-magenta">
            Catálogo independiente
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-plum sm:text-5xl">
            Potencia tu bienestar
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink/75 sm:text-lg">
            Descubre Andromeda by Kromasol y encuentra productos pensados para
            acompañar tu alimentación y tu rutina diaria.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#catalogo">Ver catálogo</Button>
            <Button variant="whatsapp" onClick={handleWhatsAppInfo} icon={<WhatsAppIcon />}>
              Comprar por WhatsApp
            </Button>
          </div>
        </div>

        <div className="animate-fade-up relative" style={{ animationDelay: '120ms' }}>
          <div className="absolute inset-8 rounded-full bg-pink-soft/70 blur-3xl" />
          <figure className="relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_18px_40px_rgba(91,18,72,0.08)]">
            <img
              src="/images/hero/hero-andromeda.jpg"
              alt="Andromeda by Kromasol junto a un batido de fresa"
              className="h-full w-full rounded-[1.4rem] object-cover"
              width={960}
              height={720}
            />
          </figure>
        </div>
      </div>
    </section>
  )
}
