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
