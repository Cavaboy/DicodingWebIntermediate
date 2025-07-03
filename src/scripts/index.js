// CSS imports
import '../styles/styles.css';

import App from './pages/app';
import StoryAPI from './data/api.js';
import { VAPID_PUBLIC_KEY } from './utils/push-constants.js';

function updateNav() {
  const navList = document.getElementById('nav-list');
  if (!navList) return;
  navList.innerHTML = '';
  if (localStorage.getItem('dicoding_token')) {
    navList.innerHTML += '<li><a href="#/">Beranda</a></li>';
    navList.innerHTML += '<li><a href="#/about">About</a></li>';
    // Tambahkan link lain jika perlu
  } else {
    navList.innerHTML += '<li><a href="#/login">Login</a></li>';
    navList.innerHTML += '<li><a href="#/register">Register</a></li>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();
  updateNav();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    updateNav();
  });

  // Service Worker registration for PWA (relative path for GitHub Pages)
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('sw.js');
        console.log('Service worker registered:', reg);

        // Request notification permission
        if (Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }

        // Only subscribe if logged in and permission granted
        if (localStorage.getItem('dicoding_token') && Notification.permission === 'granted') {
          // Subscribe to push
          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });

          // Send subscription to API
          await StoryAPI.subscribePushNotification(subscription.toJSON());
          console.log('Push notification subscribed!');
        }
      } catch (err) {
        console.error('Service worker registration or push subscription failed:', err);
      }
    });
  }

  // Helper to convert VAPID key
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
});
