import { Button } from './ui/Button'

const STEPS = [
  {
    number: '01',
    title: 'Explora',
    text: 'Encuentra los productos que buscas.',
  },
  {
    number: '02',
    title: 'Agrega al carrito',
    text: 'Selecciona productos y cantidades.',
  },
  {
    number: '03',
    title: 'Envía tu pedido',
    text: 'Recibe atención personalizada directamente por WhatsApp.',
  },
]

export function HowToBuy() {
  return (
    <section id="como-comprar" className="scroll-mt-24 bg-surface py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-plum">Cómo comprar</h2>
        <p className="mt-3 max-w-xl text-ink/70">
          Un proceso simple, sin cuentas ni pagos en línea. Tú armas el pedido y
          lo enviamos por WhatsApp.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.number} className="rounded-[1.5rem] bg-white p-6 shadow-[0_10px_24px_rgba(91,18,72,0.04)]">
              <p className="font-display text-sm font-bold tracking-[0.2em] text-gold">
                {step.number}
              </p>
              <h3 className="font-display mt-3 text-xl font-semibold text-plum">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Button href="#catalogo">Ver catálogo</Button>
        </div>
      </div>
    </section>
  )
}
