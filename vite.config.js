import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';
import { resolve } from 'path'; // You might not need this anymore

export default defineConfig({
  // Keep the base path
  base: '/DicodingWebIntermediate/',

  // The build path is fine
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },

  server: {
    https: true,
  },

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Story App',
        short_name: 'StoryApp',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'images/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: 'images/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'images/screenshot-desktop.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide'
          },
          {
            src: 'images/screenshot-mobile.png',
            sizes: '738x1600',
            type: 'image/png',
            form_factor: 'narrow'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60,
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
            },
          }
        ]
      },
    }),
    mkcert(),
  ],
});