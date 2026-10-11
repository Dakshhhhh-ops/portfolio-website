import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative asset paths so the build works on GitHub Pages sub-paths as well as a root domain
  base: './',
  plugins: [react()],
})
