import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dns from 'node:dns';
import laravel from 'laravel-vite-plugin'; 

dns.setDefaultResultOrder('verbatim');

const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://nginx'; 

export default defineConfig({
  plugins: [
    react(),
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.jsx'],
      refresh: true,
    }),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', 
    port: 5173,
    hmr: {
      host: process.env.VITE_HMR_HOST || 'localhost',
      clientPort: 5173,
      protocol: 'ws',
    },
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/broadcasting': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/sanctum': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/posts': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});