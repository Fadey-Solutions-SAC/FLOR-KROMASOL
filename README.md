# Andromeda — catálogo personal

Tienda/catálogo de una vendedora independiente. No es el sitio oficial de Kromasol.

## Cómo personalizar

Edita un solo archivo: `src/config/store.ts`

- `WHATSAPP_NUMBER`: número con código de país, solo dígitos. Perú: `51987654321`
- `CONTACT_HOURS` y `DELIVERY_ZONE`
- `INSTAGRAM_URL`, `FACEBOOK_URL`, `TIKTOK_URL` (si están vacíos, no se muestran)

Agrega productos en `src/data/products.ts` y coloca las fotos en `public/images/products/`.

## Desarrollo

```bash
npm install
npm run dev
```
