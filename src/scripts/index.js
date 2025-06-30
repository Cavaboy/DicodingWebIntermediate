// CSS imports
import '../styles/styles.css';

import App from './pages/app';

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
});
