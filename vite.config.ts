import { defineConfig } from 'vite'
import path from 'path'
import { readdir, writeFile } from 'fs/promises'
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
    // gsap ships a browser-shaped package that Node cannot import as-is;
    // bundling it into the prerender build resolves it the same way
    // the browser build does.
    noExternal: ['gsap'],
  },

  ssgOptions: {
    entry: 'src/main.tsx',
    // /software → software.html, served at /software by the host's
    // clean-URL rewriting; /404 → 404.html, the host's not-found page.
    dirStyle: 'flat',

    // sitemap.xml from the pages the build actually produced, so it can
    // never list a page that doesn't exist or miss one that does.
    async onFinished(dir) {
      const site = 'https://shubhsinghal.in'
      const files = (await readdir(dir, { recursive: true }))
        .map((f) => String(f).replace(/\\/g, '/'))
        .filter((f) => f.endsWith('.html') && f !== '404.html')
        .sort()
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = files.map((f) => {
        const route = f === 'index.html' ? '/' : `/${f.replace(/\.html$/, '')}`
        return `  <url><loc>${site}${route}</loc><lastmod>${lastmod}</lastmod></url>`
      })
      await writeFile(
        path.join(dir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
      )
    },
  },
}))
