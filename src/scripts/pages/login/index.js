import LoginPresenter from './login-presenter.js';

const LoginPage = {
  _presenter: null,
  async render() {
    return `
      <section>
          <h2>Login</h2>
          <form id="login-form">
            <div>
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="8" />
            </div>
            <button type="submit">Login</button>
          </form>
          <div id="login-message"></div>
        </section>
      </section>
    `;
  },

  async afterRender() {
    if (!this._presenter) this._presenter = new LoginPresenter(this);
    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;
      this._presenter.handleLogin(email, password);
    });
  },

  showError(message) {
    const messageDiv = document.getElementById('login-message');
    messageDiv.textContent = message;
    messageDiv.className = 'error';
  },

  showSuccess(message) {
    const messageDiv = document.getElementById('login-message');
    messageDiv.textContent = message;
    messageDiv.className = 'success';
  },

  navigateTo(path) {
    window.location.hash = path;
  }
};

export default LoginPage;
