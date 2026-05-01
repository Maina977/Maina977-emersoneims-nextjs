import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'ai-borehole-analyzer'),
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
