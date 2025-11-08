import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Increase chunk size warning limit for large assets
    chunkSizeWarningLimit: 1000,
    // Optimize asset handling for large files
    assetsInlineLimit: 4096, // Only inline assets smaller than 4KB
    rollupOptions: {
      output: {
        // Better handling of large assets
        manualChunks: undefined,
      }
    }
  },
  // Optimize dependencies for better memory usage
  optimizeDeps: {
    exclude: []
  }
})
