import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { Logo } from './Logo'
import { useCart } from '../hooks/useCart'
import { useStoreUi } from '../context/StoreUiContext'

const NAV_ITEMS = [
  { label: 'Inicio', href: '/#inicio' },
  { label: 'Catálogo', href: '/#catalogo' },
  { label: 'Beneficios', href: '/#beneficios' },
  { label: 'Cómo comprar', href: '/#como-comprar' },
  { label: 'Contacto', href: '/#contacto' },
]

export function Header() {
  const { getCartItemsCount } = useCart()
  const { openCart } = useStoreUi()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [pop, setPop] = useState(false)
  const count = getCartItemsCount()

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    if (count === 0) {
      return
    }
    setPop(true)
    const timer = window.setTimeout(() => setPop(false), 350)
    return () => window.clearTimeout(timer)
  }, [count])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-pink-soft/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/80 transition duration-200 hover:text-magenta"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito, ${count} productos`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-pink-soft text-plum transition duration-200 hover:border-magenta hover:text-magenta"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span
                className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-magenta px-1 text-[11px] font-bold text-white ${pop ? 'animate-cart-pop' : ''}`}
              >
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-plum lg:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="animate-overlay-in border-t border-pink-soft bg-white lg:hidden">
          <nav className="flex flex-col px-4 py-4" aria-label="Móvil">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base font-medium text-plum hover:bg-pink-soft/50"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/#catalogo"
              className="mt-2 rounded-full bg-magenta px-4 py-3 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Ver catálogo
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
