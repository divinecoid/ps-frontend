import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, 'packages/components'),
      '@/lib': path.resolve(__dirname, 'packages/lib'),
      '@/hooks': path.resolve(__dirname, 'packages/hooks'),
      '@/utils': path.resolve(__dirname, 'packages/lib/utils'),
      '@/services': path.resolve(__dirname, 'packages/services')
    }
  },
});
