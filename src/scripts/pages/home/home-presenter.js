import StoryAPI from '../../data/api.js';

class HomePresenter {
    constructor(view) {
        this._view = view;
    }

    async loadStories() {
        try {
            const stories = await StoryAPI.getAllStories();
            if (!stories || stories.length === 0) {
                this._view.showError('Tidak ada cerita.');
            } else {
                this._view.displayStories(stories);
            }
        } catch (err) {
            this._view.showError('Gagal memuat cerita: ' + err.message);
        }
    }
}

export default HomePresenter;
