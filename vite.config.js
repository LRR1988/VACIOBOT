import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
<<<<<<< HEAD
import { resolve } from 'path';
=======
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
<<<<<<< HEAD
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
=======
    assetsDir: 'assets'
  },
  resolve: {
    alias: {
      '@': '/src'
>>>>>>> f4f35af87693ca2d46f5347f103456e0c022af85
    }
  }
});