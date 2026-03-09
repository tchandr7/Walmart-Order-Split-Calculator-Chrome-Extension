import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
    // Strip console.log/debug/info from production builds.
    // Prevents order payload (items, prices, totals) from leaking in DevTools.
    // console.warn and console.error are kept for runtime error visibility.
    minify: 'esbuild',
  },
  esbuild: {
    pure: ['console.log', 'console.debug', 'console.info', 'console.group', 'console.groupEnd'],
    drop: ['debugger'],
  },
})
