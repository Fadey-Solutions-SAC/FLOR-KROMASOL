import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CatalogProvider } from './context/CatalogContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import { StoreUiProvider } from './context/StoreUiContext.tsx'
import { AdminProvider } from './context/AdminContext.tsx'
import App from './App.tsx'
import { routerBasename } from './utils/baseUrl.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename()}>
      <CatalogProvider>
        <CartProvider>
          <StoreUiProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </StoreUiProvider>
        </CartProvider>
      </CatalogProvider>
    </BrowserRouter>
  </StrictMode>,
)
