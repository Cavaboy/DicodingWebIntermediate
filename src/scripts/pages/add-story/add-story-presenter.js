import StoryAPI from '../../data/api.js';

const AddStoryPresenter = {
    async addStory(formData) {
        return await StoryAPI.addNewStory(formData);
    },

    stopCameraStream(stream) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    },

    async initializeCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            return { success: true, stream };
        } catch (err) {
            return { success: false, error: err.message };
        }
    },

    getMapConfig() {
        return {
            defaultView: [-2.5, 118],
            defaultZoom: 5,
            tileLayer: {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors'
            }
        };
    },

    capturePhoto(video, canvas) {
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/jpeg');
        });
    },

    createFormData(description, photoBlob, lat, lon) {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photoBlob, 'photo.jpg');
        formData.append('lat', lat);
        formData.append('lon', lon);
        return formData;
    }
};

export default AddStoryPresenter;
