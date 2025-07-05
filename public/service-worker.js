const CACHE_NAME = 'story-app-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/src/styles/main.css',
    '/src/scripts/main.js',
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
