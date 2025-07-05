import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/DicodingWebIntermediate/',
  plugins: [
    // ...plugin lain yang mungkin sudah ada, seperti vue() atau react()

    VitePWA({
      // Opsi 1: Mengontrol bagaimana service worker diperbarui.
      // 'autoUpdate' akan otomatis memperbarui service worker di latar belakang.
      registerType: 'autoUpdate',

      // Opsi 2: Konfigurasi untuk manifest web app Anda.
      manifest: {
        name: 'Story App',
        short_name: 'StoryApp',
        description: 'Aplikasi berbagi cerita dari Dicoding.',
        theme_color: '#ffffff',
        // Arahkan ke ikon yang ada di folder `public` Anda
        icons: [
          {
            src: 'images/icon-144x144.png', // path relatif dari folder public
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      // Opsi 3: Konfigurasi untuk Workbox (engine di balik plugin ini).
      workbox: {
        // Ini akan secara otomatis mencari SEMUA aset Anda (JS, CSS, gambar, dll.)
        // dan menyimpannya di cache saat instalasi. Tidak perlu daftar manual lagi!
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],

        // Ini adalah pengganti logic 'fetch' manual Anda.
        runtimeCaching: [
          {
            // Aturan untuk API call (Network First, dengan fallback ke cache)
            // Cocok untuk semua URL yang mengandung '/v1/stories'
            urlPattern: ({ url }) => url.pathname.includes('/v1/stories'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Aturan untuk Google Fonts atau font eksternal lainnya (Cache First)
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});