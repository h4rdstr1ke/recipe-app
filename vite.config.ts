import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Настраиваем кэширование всей статики, включая картинки блюд
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}']
      },
      manifest: {
        name: 'Вкусно Просто',
        short_name: 'Вкусно Просто',
        description: 'Ваши любимые рецепты всегда под рукой',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    svgr()
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: true   // Временно
    ,
    proxy: {
      '/api': {
        target: 'http://158.160.6.41',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://158.160.6.41',
        changeOrigin: true,
      },
      // Прокси для Python-сервиса
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Эта строчка отрезает /ai, чтобы Python получил чистый /api/chat
        rewrite: (path) => path.replace(/^\/ai/, '')
      }
    }
  }
})
