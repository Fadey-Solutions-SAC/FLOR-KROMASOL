import { Droplets, HeartPulse, Leaf, Sparkles } from 'lucide-react'

const CARDS = [
  {
    icon: Sparkles,
    title: 'Vitaminas y minerales',
    text: 'Una forma práctica de complementar tu alimentación diaria con micronutrientes.',
  },
  {
    icon: HeartPulse,
    title: 'Proteína',
    text: 'Pensada para acompañar tu rutina, el movimiento y una alimentación equilibrada.',
  },
  {
    icon: Leaf,
    title: 'Fibra',
    text: 'Incluye fibra como parte de un batido que puedes integrar en tu día a día.',
  },
  {
    icon: Droplets,
    title: 'Bienestar',
    text: 'Productos para quienes buscan una opción rica, cómoda y fácil de preparar.',
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="scroll-mt-24 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display max-w-xl text-3xl font-bold text-plum">
          Encuentra lo que necesitas para tu rutina
        </h2>
        <p className="mt-3 max-w-2xl text-ink/70">
          Andromeda reúne vitaminas, minerales, proteína y fibra en un suplemento
          en polvo de sabor fresas con crema, para preparar batidos y acompañar
          tu alimentación.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, index) => (
            <article
              key={card.title}
              className="animate-fade-up rounded-[1.4rem] border border-pink-soft bg-surface p-5"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <card.icon className="text-magenta" size={22} />
              <h3 className="font-display mt-4 text-lg font-semibold text-plum">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{card.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
