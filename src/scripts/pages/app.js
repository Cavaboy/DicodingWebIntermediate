
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import renderNotFoundPage from './not-found.js';


class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #lastPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#lastPage = null;
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {

    const url = getActiveRoute();
    let page = routes[url];

    // If route not found, use Not Found page
    if (!page) {
      this.#content.innerHTML = renderNotFoundPage();
      this.#lastPage = null;
      return;
    }

    // Call onDestroy on previous page if exists
    if (this.#lastPage && typeof this.#lastPage.onDestroy === 'function') {
      try {
        this.#lastPage.onDestroy();
      } catch (e) {
        // ignore errors in cleanup
      }
    }

    this.#content.innerHTML = await page.render();
    if (typeof page.afterRender === 'function') {
      await page.afterRender();
    }
    this.#lastPage = page;
  }
}

export default App;
