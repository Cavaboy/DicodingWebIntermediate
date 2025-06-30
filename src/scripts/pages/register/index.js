import RegisterPresenter from './register-presenter.js';

const RegisterPage = {
  _presenter: null,
  async render() {
    return `
      <section>
          <h2>Register</h2>
          <form id="register-form">
            <div>
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div>
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div>
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="8" />
            </div>
            <button type="submit">Register</button>
          </form>
          <div id="register-message"></div>
        </section>
      </section>
    `;
  },

  async afterRender() {
    if (!this._presenter) this._presenter = new RegisterPresenter(this);
    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;
      this._presenter.handleRegister(name, email, password);
    });
  },

  showError(message) {
    const messageDiv = document.getElementById('register-message');
    messageDiv.textContent = message;
    messageDiv.className = 'error';
  },

  showSuccess(message) {
    const messageDiv = document.getElementById('register-message');
    messageDiv.textContent = message;
    messageDiv.className = 'success';
  },

  navigateTo(path) {
    window.location.hash = path;
  }
};

export default RegisterPage;
