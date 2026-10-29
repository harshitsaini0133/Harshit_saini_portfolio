import { defineConfig } from 'vite'
import { portfolioHtml } from './build/portfolio-html.js'

// Static HTML plus progressive TypeScript enhancements; no hydration required.
export default defineConfig({
  base: '/Harshit_saini_portfolio/',
  plugins: [portfolioHtml()],
  build: { assetsInlineLimit: 0 },
})
