import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { catalogSyncPlugin } from './vite-plugin-catalog-sync.ts'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/FLOR-KROMASOL/' : '/',
  plugins: [react(), tailwindcss(), catalogSyncPlugin()],
})
