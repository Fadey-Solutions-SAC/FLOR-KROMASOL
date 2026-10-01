import { CheckCircle2, RefreshCcw, Sparkles } from 'lucide-react'

const ITEMS = [
  { icon: Sparkles, title: 'Compra fácil', text: 'Elige, agrega y envía tu pedido.' },
  { icon: CheckCircle2, title: 'Atención personalizada', text: 'Te acompañamos en cada consulta.' },
  { icon: RefreshCcw, title: 'Catálogo actualizado', text: 'Precios y presentaciones vigentes.' },
]

export function TrustBar() {
  return (
    <section className="border-y border-pink-soft/80 bg-white" aria-label="Razones para comprar">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3 sm:px-6">
        {ITEMS.map((item) => (
          <article
            key={item.title}
            className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-4"
          >
            <item.icon className="mt-0.5 shrink-0 text-magenta" size={20} />
            <div>
              <h2 className="text-sm font-semibold text-plum">{item.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink/65">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
