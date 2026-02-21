import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/v1': {
        target: 'https://api-sandbox.factus.com.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, '/v1')
      },
      '/oauth': {
        target: 'https://api-sandbox.factus.com.co',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
