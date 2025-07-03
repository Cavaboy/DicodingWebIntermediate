import * as dbHelper from '../../utils/indexeddb-helper.js';

const SavedStoriesPage = {
  async render() {
    return `
      <section class="container">
        <h2>Saved Stories</h2>
        <div id="saved-stories-container"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('saved-stories-container');
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
};

export default SavedStoriesPage;
