import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { ProductModal } from './components/ProductModal'
import { WhatsAppButton } from './components/WhatsAppButton'
import { Toast } from './components/ui/Toast'
import { OrderReadyDialog } from './components/OrderReadyDialog'
import { ConfigDialog } from './components/ConfigDialog'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminPanel } from './components/admin/AdminPanel'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { useStoreUi } from './context/StoreUiContext'
import { useCatalog } from './context/CatalogContext'
import { useCart } from './hooks/useCart'

export default function App() {
  const {
    cartOpen,
    closeCart,
    selectedProduct,
    closeProduct,
    toast,
    hideToast,
    orderReadyOpen,
    closeOrderReady,
    configOpen,
    closeConfig,
  } = useStoreUi()
  const { products } = useCatalog()
  const { syncWithCatalog } = useCart()
  const location = useLocation()

  useEffect(() => {
    syncWithCatalog(products)
  }, [products, syncWithCatalog])

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-svh bg-white">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-magenta focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <ProductModal product={selectedProduct} onClose={closeProduct} />
      <OrderReadyDialog open={orderReadyOpen} onClose={closeOrderReady} />
      <ConfigDialog open={configOpen} onClose={closeConfig} />
      <AdminLogin />
      <AdminPanel />
      <Toast message={toast} onClose={hideToast} />
    </div>
  )
}
