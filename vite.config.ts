import tailwind from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig(({ isSsrBuild }) => ({
  appType: 'mpa',
  plugins: [react(), tailwind()],
  // three is one lazy chunk by design, so the default warning is noise.
  build: { copyPublicDir: !isSsrBuild, chunkSizeWarningLimit: 800 },
  ssr: { noExternal: ['@phosphor-icons/react'] },
  preview: { port: 4893, strictPort: true },
}))
