// Service Worker: Push Notification Handler
[{"revision":null,"url":"assets/index-COFV18os.css"},{"revision":null,"url":"assets/index-DUauxctK.js"},{"revision":"951f61f2416068b08b77ecaa0f9a5807","url":"index.html"},{"revision":"ef2bd59a8219ecd1543e070b531f0f58","url":"registerSW.js"},{"revision":"bfb3275ec519b339497477087bde49b5","url":"sw.js"},{"revision":"483eed3b9a1d2c279fe9e84bc9d75fe5","url":"manifest.webmanifest"}];

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
const CACHE_NAME = 'app-shell-v2';
const APP_SHELL = [
    '/DicodingWebIntermediate/index.html',
    '/DicodingWebIntermediate/manifest.json',
    '/DicodingWebIntermediate/favicon.png',
    '/DicodingWebIntermediate/images/icon-144x144.png',
    '/DicodingWebIntermediate/images/screenshot-desktop.png',
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
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
