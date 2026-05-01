import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.io', 'localhost'],
    proxy: {
      // Backend Express server defaults to PORT 3000 (see server/index.js).
      // Override with VITE_API_TARGET if you run the API on a different port.
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'react-hot-toast', 'recharts']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@crcComponents': path.resolve(__dirname, './components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@core': path.resolve(__dirname, './core'),
      '@decision': path.resolve(__dirname, './components/decision'),
      '@calculator': path.resolve(__dirname, './components/calculator'),
      '@design': path.resolve(__dirname, './components/design'),
      '@investment': path.resolve(__dirname, './components/investment'),
      '@landing': path.resolve(__dirname, './components/landing')
    }
  }
});
