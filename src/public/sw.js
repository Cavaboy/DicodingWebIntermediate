// Service Worker: Push Notification Handler
self.addEventListener('push', function (event) {
    let body = 'No payload';
    if (event.data) {
        body = event.data.text();
    }
    const options = {
        body: body,
        icon: '/favicon.png', // Simple icon, adjust path as needed
    };
    event.waitUntil(
        self.registration.showNotification('New Notification!', options)
    );
});

// --- Basic App Shell Offline Caching ---
const CACHE_NAME = 'app-shell-v1';
const APP_SHELL = [
    '/DicodingWebIntermediate/',
    '/DicodingWebIntermediate/index.html',
    '/DicodingWebIntermediate/manifest.json',
    '/DicodingWebIntermediate/assets/index-COFV18os.css',
    '/DicodingWebIntermediate/assets/index-BroGuHBy.js',
    '/DicodingWebIntermediate/images/logo.png',
    '/DicodingWebIntermediate/favicon.png',
    // add more assets as needed
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                if (event.request.headers.get('accept').includes('text/html')) {
                    return new Response('<h2 style="text-align:center;margin-top:2em;">You are offline.<br>Halaman tidak tersedia.</h2>', {
                        headers: { 'Content-Type': 'text/html' },
                    });
                }
            });
        })
    );
});
