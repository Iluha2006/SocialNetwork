import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dns from 'node:dns';
import laravel from 'laravel-vite-plugin'; 

dns.setDefaultResultOrder('verbatim');

const proxyTarget = process.env.VITE_PROXY_TARGET || 'http://localhost:8088'; 

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  },
  plugins: [
    react(),
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.jsx'],
      refresh: true,
    }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],
        },
      },
    },
  },
  server: {
    host: 'localhost', 
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
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
      '/social-media': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
