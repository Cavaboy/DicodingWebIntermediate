import StoryAPI from '../../data/api.js';

class RegisterPresenter {
    constructor(view) {
        this._view = view;
    }

    async handleRegister(name, email, password) {
        try {
            await StoryAPI.register(name, email, password);
            this._view.showSuccess('Register berhasil! Silakan login.');
            this._view.navigateTo('/login');
        } catch (err) {
            this._view.showError('Register gagal: ' + err.message);
        }
    }
}

export default RegisterPresenter;
