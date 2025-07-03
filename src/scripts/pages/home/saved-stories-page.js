import * as dbHelper from '../../utils/indexeddb-helper.js';

const SavedStoriesPage = {
    async render() {
        return `
      <section class="container">
        <h2>Saved Stories</h2>
        <button id="clear-saved-stories-btn" style="margin-bottom:1rem">Kosongkan Saved Stories</button>
        <div id="saved-stories-container"></div>
      </section>
    `;
    },

    async afterRender() {
        const container = document.getElementById('saved-stories-container');
        const clearBtn = document.getElementById('clear-saved-stories-btn');
        async function renderSavedStories() {
            container.innerHTML = '<p>Loading saved stories...</p>';
            const stories = await dbHelper.getAllStories();
            if (!stories.length) {
                container.innerHTML = '<p>Tidak ada cerita yang disimpan.</p>';
                return;
            }
            container.innerHTML = '';
            stories.forEach(story => {
                const storyElem = document.createElement('div');
                storyElem.className = 'story-item';
                storyElem.innerHTML = `
          <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" loading="lazy" />
          <h4>${story.name}</h4>
          <p>${story.description}</p>
          <p><small>${new Date(story.createdAt).toLocaleString()}</small></p>
          <button class="remove-saved-story-btn" data-id="${story.id}">Hapus</button>
        `;
                container.appendChild(storyElem);
            });
            container.querySelectorAll('.remove-saved-story-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = btn.getAttribute('data-id');
                    await dbHelper.deleteStory(id);
                    btn.closest('.story-item').remove();
                    if (!container.querySelector('.story-item')) {
                        container.innerHTML = '<p>Tidak ada cerita yang disimpan.</p>';
                    }
                });
            });
        }
        clearBtn.addEventListener('click', async () => {
            // Hapus semua story di IndexedDB
            const stories = await dbHelper.getAllStories();
            for (const s of stories) {
                await dbHelper.deleteStory(s.id);
            }
            renderSavedStories();
        });
        renderSavedStories();
    }
};

export default SavedStoriesPage;
