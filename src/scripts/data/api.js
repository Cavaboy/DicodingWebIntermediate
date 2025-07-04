import API_CONFIG from '../utils/config.js';

class StoryAPI {
  static getToken() {
    return localStorage.getItem('dicoding_token');
  }

  static async subscribePushNotification(subscription) {
    const token = this.getToken();
    const { expirationTime, ...subscriptionWithoutExpiration } = subscription;
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscriptionWithoutExpiration),
    });
    if (!response.ok) {
      throw new Error('Failed to subscribe push notification.');
    }
    return response.json();
  }

  static async getAllStories({ page = 1, size = 10, location = 1 } = {}) {
    const token = this.getToken();
    const url = `${API_CONFIG.GET_ALL_STORIES}?page=${page}&size=${size}&location=${location}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch stories.');
    }
    const responseJson = await response.json();
    return responseJson.listStory;
  }

  static async addNewStory(storyData) {
    const token = this.getToken();
    const response = await fetch(API_CONFIG.ADD_NEW_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: storyData,
    });
    if (!response.ok) {
      throw new Error('Failed to post new story.');
    }
    return response.json();
  }

  static async login(email, password) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Login failed.');
    }
    const data = await response.json();
    if (data.loginResult && data.loginResult.token) {
      localStorage.setItem('dicoding_token', data.loginResult.token);
    }
    return data;
  }

  static async register(name, email, password) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      throw new Error('Register failed.');
    }
    return response.json();
  }

  static async getStoryDetail(id) {
    const token = this.getToken();
    const response = await fetch(`${API_CONFIG.GET_ALL_STORIES}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch story detail.');
    }
    return response.json();
  }
}

export default StoryAPI;