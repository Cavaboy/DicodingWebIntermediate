import routes from './routes/routes.js';
import UrlParser from './routes/url-parser.js';
import BasePresenter from './presenters/base-presenter.js';

class App {
    constructor(app) {
        this._app = app;
        this.renderPage = this.renderPage.bind(this);
        window.addEventListener('hashchange', this.renderPage);
        window.addEventListener('load', this.renderPage);
    } async renderPage() {
        const url = UrlParser.parseActiveUrlWithCombiner();
        let page = routes[url] || routes['/'];

        // Check if route requires authentication
        if (page.requiresAuth && !BasePresenter.isAuthenticated()) {
            window.location.hash = '/login';
            return;
        }

        // Check if login/register page when already authenticated
        if ((url === '/login' || url === '/register') && BasePresenter.isAuthenticated()) {
            window.location.hash = '/';
            return;
        }

        if (document.startViewTransition) {
            document.startViewTransition(async () => {
                this._app.innerHTML = await page.render();
                if (page.afterRender) await page.afterRender();
            });
        } else {
            this._app.innerHTML = await page.render();
            if (page.afterRender) await page.afterRender();
        }
    }
}

export default App;
