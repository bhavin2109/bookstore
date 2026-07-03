import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('react-helmet-async')) {
              return 'react-core';
            }
            if (id.includes('react-router') || id.includes('remix-run')) {
              return 'react-router';
            }
            if (id.includes('@reduxjs') || id.includes('redux')) {
              return 'redux';
            }
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('lucide-react') || id.includes('lucide')) {
              return 'lucide-icons';
            }
            if (id.includes('@react-oauth')) {
              return 'google-oauth';
            }
            if (id.includes('axios')) {
              return 'axios';
            }
            if (id.includes('socket.io-client')) {
              return 'socket-io';
            }
            return 'vendor-helpers';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})
// Force restart to pick up new dependencies
