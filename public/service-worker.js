const CACHE_NAME = 'story-app-cache-v2';
const BASE_PATH = '/DicodingWebIntermediate';
const ASSETS_TO_CACHE = [
    BASE_PATH + '/',
    BASE_PATH + '/index.html',
    BASE_PATH + '/manifest.json',
    BASE_PATH + '/favicon.png',
    BASE_PATH + '/sw.js',
    BASE_PATH + '/assets/index-BwugldLg.js',
    BASE_PATH + '/assets/index-COFV18os.css',
    BASE_PATH + '/images/icon-144x144.png',
    BASE_PATH + '/images/logo.png',
    BASE_PATH + '/images/screenshot-desktop.png',
];

// Install: cache asset statis
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
    );
});

// Activate: hapus cache lama
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        )
    );
});

// Fetch: cache first untuk asset, network first untuk API
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 1. Prioritaskan Network First untuk API
    if (url.pathname.includes('/v1/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Jika berhasil, simpan clone-nya ke cache
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    // Jika jaringan gagal, coba ambil dari cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Jika ada di cache, gunakan cache. Jika tidak, ambil dari jaringan.
            return cachedResponse || fetch(event.request);
        })
    );
});
