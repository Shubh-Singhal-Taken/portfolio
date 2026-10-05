import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
// Brings in the `ssgOptions` field on Vite's config type.
import type {} from 'vite-react-ssg/node'

export default defineConfig(({ isSsrBuild }) => ({
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
      // Long-cached vendor chunks for the browser build only; the server
      // build that prerenders the pages has no use for them.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              three: ['three'],
              gsap: ['gsap'],
            },
          },
    },
  },

  ssr: {
    // These ship browser-shaped packages that Node cannot import as-is;
    // bundling them into the prerender build resolves them the same way
    // the browser build does.
    noExternal: ['gsap', 'typed.js'],
  },

  ssgOptions: {
    entry: 'src/main.tsx',
    // /software → software.html, served at /software by the host's
    // clean-URL rewriting; /404 → 404.html, the host's not-found page.
    dirStyle: 'flat',
  },
}))
