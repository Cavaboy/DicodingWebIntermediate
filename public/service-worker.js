const CACHE_NAME = 'story-app-cache-v2';
const BASE_PATH = '/DicodingWebIntermediate';
const ASSETS_TO_CACHE = [
    BASE_PATH + '/',
    BASE_PATH + '/index.html',
    BASE_PATH + '/manifest.json',
    BASE_PATH + '/src/styles/styles.css',
    BASE_PATH + '/src/scripts/main.js',
    BASE_PATH + '/src/scripts/data/api.js',
    BASE_PATH + '/src/scripts/app.js',
    BASE_PATH + '/src/scripts/config.js',
    BASE_PATH + '/src/scripts/index.js',
    BASE_PATH + '/src/public/favicon.png',
    BASE_PATH + '/src/public/sw.js',
    BASE_PATH + '/src/public/images/icon-144x144.png',
    BASE_PATH + '/src/public/images/logo.png',
    BASE_PATH + '/src/public/images/screenshot-desktop.png',
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

    // Cache first untuk asset statis
    if (ASSETS_TO_CACHE.includes(url.pathname) || url.origin === location.origin) {
        event.respondWith(
            caches.match(event.request).then((cached) => cached || fetch(event.request))
        );
        return;
    }

    // Network first untuk API
    if (url.pathname.startsWith('/v1/stories')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
});
