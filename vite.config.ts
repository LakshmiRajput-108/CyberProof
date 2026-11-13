import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    allowedHosts: ['ste-connect-definitely-backgrounds.trycloudflare.com'],
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  preview: {
    allowedHosts: ['cyberproof-frontend1.onrender.com'],
  },
});