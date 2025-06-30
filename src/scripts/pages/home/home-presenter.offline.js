import StoryAPI from '../../data/api.js';
import * as dbHelper from '../../utils/indexeddb-helper.js';

class HomePresenter {
    constructor(view) {
        this._view = view;
    }

    async loadStories() {
        try {
            // Try to fetch stories from API
            const stories = await StoryAPI.getAllStories();
            // Clear old stories in IndexedDB
            const oldStories = await dbHelper.getAllStories();
            for (const old of oldStories) {
                await dbHelper.deleteStory(old.id);
            }
            // Save new stories to IndexedDB
            for (const story of stories) {
                await dbHelper.putStory(story);
            }
            // Render stories to UI
            if (!stories || stories.length === 0) {
                this._view.showError('Tidak ada cerita.');
            } else {
                this._view.displayStories(stories);
            }
        } catch (err) {
            // If fetch fails (offline): get stories from IndexedDB
            const offlineStories = await dbHelper.getAllStories();
            if (!offlineStories || offlineStories.length === 0) {
                this._view.showError('Gagal memuat cerita: ' + err.message);
            } else {
                this._view.displayStories(offlineStories);
                if (typeof this._view.showToast === 'function') {
                    this._view.showToast('Anda sedang offline. Menampilkan cerita yang tersimpan.');
                }
            }
        }
    }
}

export default HomePresenter;
