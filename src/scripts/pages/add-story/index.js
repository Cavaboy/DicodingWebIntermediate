import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AddStoryPresenter from './add-story-presenter.js';

const AddStoryPage = {
    _stream: null,
    async render() {
        return `
      <section>
          <h2>Tambah Cerita</h2>
          <form id="add-story-form">
            <div>
              <label for="description">Deskripsi Cerita</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            <div>
              <label>Lokasi Cerita</label>
              <div id="map-picker" style="height: 300px;"></div>
            </div>
            <div>
              <label>Ambil Foto</label>
              <video id="camera-preview" autoplay playsinline width="320" height="240"></video>
              <canvas id="photo-canvas" width="320" height="240" style="display:none;"></canvas>
              <button type="button" id="capture-btn">Ambil Foto</button>
            </div>
            <button type="submit">Kirim Cerita</button>
          </form>
          <div id="add-story-message"></div>
        </section>
      </section>
    `;
    },

    async afterRender() {
        // Camera logic
        const video = document.getElementById('camera-preview');
        const canvas = document.getElementById('photo-canvas');
        const captureBtn = document.getElementById('capture-btn');
        let photoBlob = null;
        const cameraResult = await AddStoryPresenter.initializeCamera();
        if (cameraResult.success) {
            this._stream = cameraResult.stream;
            video.srcObject = this._stream;
        } else {
            video.parentElement.innerHTML += `<p class="error">Tidak dapat mengakses kamera: ${cameraResult.error}</p>`;
        }
        captureBtn.addEventListener('click', async () => {
            photoBlob = await AddStoryPresenter.capturePhoto(video, canvas);
        });

        // Map picker logic
        let lat = null, lon = null, marker = null;
        const map = L.map('map-picker').setView([-2.5, 118], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        map.on('click', function (e) {
            lat = e.latlng.lat;
            lon = e.latlng.lng;
            if (marker) marker.setLatLng(e.latlng);
            else marker = L.marker(e.latlng).addTo(map);
        });

        // Form submit logic
        const form = document.getElementById('add-story-form');
        const messageDiv = document.getElementById('add-story-message');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!photoBlob) {
                messageDiv.textContent = 'Silakan ambil foto terlebih dahulu.';
                return;
            }
            if (!lat || !lon) {
                messageDiv.textContent = 'Silakan pilih lokasi pada peta.';
                return;
            }
            const formData = AddStoryPresenter.createFormData(form.description.value, photoBlob, lat, lon);
            try {
                await AddStoryPresenter.addStory(formData);
                messageDiv.textContent = 'Cerita berhasil ditambahkan!';
                if (this._stream) {
                    this._stream.getTracks().forEach(track => track.stop());
                    this._stream = null;
                }
                setTimeout(() => {
                    window.location.hash = '/';
                }, 1000);
            } catch (err) {
                messageDiv.textContent = 'Gagal menambah cerita: ' + err.message;
                if (this._stream) {
                    this._stream.getTracks().forEach(track => track.stop());
                    this._stream = null;
                }
            }
        });
    },

    onDestroy() {
        if (this._stream) {
            this._stream.getTracks().forEach(track => track.stop());
            this._stream = null;
        }
    }
};

export default AddStoryPage;
