import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Dev-only: run the Vercel serverless functions in api/ during `npm run dev`.
// The plain Vite dev server does not serve the api/ folder (that is a Vercel
// feature), so without this the frontend's /api/* fetches fall through to the
// SPA and the price/lookup features can't be exercised locally. Only GET is
// intercepted so POST endpoints (feedback) keep their existing behavior.
// Reads .env / .env.local into process.env so the handlers see the API key.
function devApiPlugin() {
  return {
    name: 'dev-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v
      }

      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' || !req.url || !req.url.startsWith('/api/')) {
          return next()
        }
        try {
          const url = new URL(req.url, 'http://localhost')
          const name = url.pathname.replace(/^\/api\//, '').replace(/\.js$/, '')
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          if (typeof mod.default !== 'function') return next()

          const shimReq = {
            method: req.method,
            headers: req.headers,
            query: Object.fromEntries(url.searchParams),
          }
          const shimRes = {
            statusCode: 200,
            status(code) { this.statusCode = code; return this },
            setHeader(k, v) { res.setHeader(k, v); return this },
            json(obj) {
              res.statusCode = this.statusCode
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(obj))
            },
            end(body) { res.statusCode = this.statusCode; res.end(body) },
          }
          await mod.default(shimReq, shimRes)
        } catch (err) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ source: 'unavailable', reason: 'dev_middleware_error', message: String(err) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    devApiPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Domicile — Registered Account Locator',
        short_name: 'Domicile',
        description: 'Find the right FHSA, TFSA, or RRSP address for every ETF and stock you hold.',
        theme_color: '#101B30',
        background_color: '#101B30',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
