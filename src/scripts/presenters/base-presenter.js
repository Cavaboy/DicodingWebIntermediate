import StoryAPI from '../data/api.js';

const BasePresenter = {
    isAuthenticated() {
        return !!StoryAPI.getToken();
    },

    // Remove all redirect logic from presenter. Redirect should be handled by view.
};

export default BasePresenter;
