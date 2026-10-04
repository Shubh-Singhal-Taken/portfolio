import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    rollupOptions: {
      output: {
        // Keep three + gsap out of the entry chunk so the initial paint is not
        // blocked by the WebGL runtime. The game splits itself via lazy import.
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
})
