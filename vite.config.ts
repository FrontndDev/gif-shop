import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/payments': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/paypal': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/stripe': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api/telegram': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});


