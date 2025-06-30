import HomePage from '../pages/home/index.js';
import AddStoryPage from '../pages/add-story/index.js';
import LoginPage from '../pages/login/index.js';
import RegisterPage from '../pages/register/index.js';

const routes = {
  '/': { ...HomePage, requiresAuth: true },
  '/add-story': { ...AddStoryPage, requiresAuth: true },
  '/login': LoginPage,
  '/register': RegisterPage,
};

export default routes;