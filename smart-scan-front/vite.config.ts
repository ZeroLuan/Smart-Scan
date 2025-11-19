import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Permite acesso pela rede (necessário para celular)
    allowedHosts: true, // Permite qualquer URL de túnel (ngrok/localtunnel)
  },
})