import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fixLeafletIcon } from '../../utils/leaflet-fix.js';
import HomePresenter from './home-presenter.offline.js';

const HomePage = {
  _presenter: null,
  async render() {
    return `
      <section>
          <h2>Daftar Cerita</h2>
          <div id="stories-container" class="stories" tabindex="-1"></div>
        </section>
        <section>
          <h2>Peta Lokasi Cerita</h2>
          <div id="map" style="height: 400px;"></div>
        </section>
        <button class="add-story-btn" aria-label="Tambah Cerita">+</button>
      </section>
      <footer>
        <p>&copy; 2025 Dicoding Story App</p>
      </footer>
    `;
  },

  async afterRender() {
    fixLeafletIcon();
    if (!this._presenter) this._presenter = new HomePresenter(this);
    const container = document.getElementById('stories-container');
    container.innerHTML = '<p>Loading stories...</p>';
    this._presenter.loadStories();
    const addButton = document.querySelector('.add-story-btn');
    addButton.onclick = () => this.navigateTo('/add-story');
  },

  displayStories(stories) {
    const container = document.getElementById('stories-container');
    container.innerHTML = '';
    stories.forEach(story => {
      const storyElem = document.createElement('div');
      storyElem.className = 'story-item';
      storyElem.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" loading="lazy" />
        <h4>${story.name}</h4>
        <p>${story.description}</p>
        <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
        <button class="save-story-btn" data-id="${story.id}">Simpan</button>
      `;
      container.appendChild(storyElem);
    });
    // Tambahkan event listener untuk tombol simpan
    container.querySelectorAll('.save-story-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = btn.getAttribute('data-id');
        const story = stories.find(s => s.id == id);
        if (story) {
          try {
            const dbHelper = await import('../../utils/indexeddb-helper.js');
            await dbHelper.putStory(story);
            this.showToast('Cerita disimpan untuk offline!');
          } catch (err) {
            this.showToast('Gagal menyimpan cerita: ' + err.message);
          }
        }
      });
    });
    this._initializeMap(stories);
  },

  showToast(message) {
    // Simple toast implementation
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.style.position = 'fixed';
      toast.style.bottom = '32px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = '#333';
      toast.style.color = '#fff';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '6px';
      toast.style.zIndex = '99999';
      toast.style.fontSize = '1rem';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3500);
  },

  showError(message) {
    const container = document.getElementById('stories-container');
    container.innerHTML = `<p class="error">${message}</p>`;
  },

  navigateTo(path) {
    window.location.hash = path;
  },

  _initializeMap(stories) {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;
    const map = L.map(mapDiv).setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }
};

export default HomePage;
