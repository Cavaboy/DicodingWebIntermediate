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
      // Your PWA settings are fine
      // This plugin generates the manifest for you,
      // so you don't need a manifest.webmanifest file in your public folder.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Story App',
        short_name: 'StoryApp',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'images/icon-192x192.png', // Use relative paths here
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/icon-512x512.png', // And here
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      // ... your workbox settings
    }),
    mkcert(),
  ],
});