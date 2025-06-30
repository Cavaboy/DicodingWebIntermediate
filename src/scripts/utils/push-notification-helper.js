// Push Notification Utility
// Usage: import { requestNotificationPermission, subscribeToPushNotifications } from './push-notification-helper.js';

const VAPID_PUBLIC_KEY = '[PASTE_VAPID_PUBLIC_KEY_DARI_API_ANDA_DI_SINI]';

export function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('This browser does not support notifications.');
        return;
    }
    return Notification.requestPermission();
}

export async function subscribeToPushNotifications(swRegistration) {
    if (!('PushManager' in window)) {
        alert('Push messaging is not supported.');
        return null;
    }
    try {
        // Check for existing subscription
        const existing = await swRegistration.pushManager.getSubscription();
        if (existing) {
            console.log('Already subscribed:', existing);
            return existing;
        }
        // Subscribe
        const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        console.log('Push subscription:', subscription);
        return subscription;
    } catch (err) {
        console.error('Failed to subscribe to push notifications:', err);
        return null;
    }
}

export function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
