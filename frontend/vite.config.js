
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona todas as chamadas /api para o seu backend
      '/api': {
        target: 'http://localhost:3000', // O endereço do seu backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api antes de enviar
      },
    },
  },
})