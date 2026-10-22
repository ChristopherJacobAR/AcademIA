import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Academia Científica IA',
        short_name: 'AcademIA',
        description: 'Sistema personal de aprendizaje científico exigente y videojuegos de física/matemáticas/química/ingeniería.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 MB to precache catalog.json
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
  resolve: {
    alias: {
      '@academia/core': path.resolve(__dirname, '../../packages/core/src'),
      '@academia/storage': path.resolve(__dirname, '../../packages/storage/src')
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
