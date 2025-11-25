import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: "./",
  build: {
    chunkSizeWarningLimit: 1500
  },
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'packages/components'),
      '@/config': path.resolve(__dirname, 'packages/config'),
      '@/hooks': path.resolve(__dirname, 'packages/hooks'),
      '@/lib': path.resolve(__dirname, 'packages/lib'),
      '@/interfaces': path.resolve(__dirname, 'packages/interfaces'),
      '@/provider': path.resolve(__dirname, 'packages/provider'),
      '@/services': path.resolve(__dirname, 'packages/services')
    }
  },
});
