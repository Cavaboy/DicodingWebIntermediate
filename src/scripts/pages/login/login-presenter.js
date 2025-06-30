import StoryAPI from '../../data/api.js';

class LoginPresenter {
    constructor(view) {
        this._view = view;
    }

    async handleLogin(email, password) {
        try {
            await StoryAPI.login(email, password);
            this._view.showSuccess('Login berhasil!');
            this._view.navigateTo('/');
        } catch (err) {
            this._view.showError('Login gagal: ' + err.message);
        }
    }
}

export default LoginPresenter;
