const CACHE_NAME = 'story-app-cache-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/src/index.html',
    '/src/manifest.json',
    '/src/styles/styles.css',
    '/src/scripts/main.js',
    '/src/scripts/data/api.js',
    '/src/scripts/app.js',
    '/src/scripts/config.js',
    '/src/scripts/index.js',
    '/src/public/favicon.png',
    '/src/public/sw.js',
    '/src/public/images/icon-144x144.png',
    '/src/public/images/logo.png',
    '/src/public/images/screenshot-desktop.png',
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
