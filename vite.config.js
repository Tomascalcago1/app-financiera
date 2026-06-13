import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('lucide')) {
              return 'vendor-lucide';
            }
            if (id.includes('@vercel')) {
              return 'vendor-vercel';
            }
            if (
              id.includes('recharts') || 
              id.includes('d3') || 
              id.includes('victory-vendor') || 
              id.includes('redux') || 
              id.includes('reselect') || 
              id.includes('use-sync-external-store') || 
              id.includes('tiny-invariant')
            ) {
              return 'vendor-charts';
            }
          }
        }
      }
    }
  }
})
