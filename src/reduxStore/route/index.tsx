import axios from 'axios';
import TokenService from '../../api/token.service';
import { refreshToken } from '../reducer/authenticateReducer';

const api = axios.create({
  baseURL:
    `${process.env.REACT_APP_BASE_URL}/api` || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config: any) => {
    config.headers = {
      ...config.headers,
      authorization: localStorage.getItem('token')
        ? `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`
        : '',
      'Content-Type': 'application/json',
    };

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (next: any) => {
    return Promise.resolve(next);
  },
  (error: any) => {
    if (error.response.status === 401) {
      Logout();
    }
    return Promise.reject(error);
  }
);

function Logout() {
  TokenService.RemoveAccessToken();
  TokenService.RemoveRefreshToken();
  localStorage.removeItem('role');
  localStorage.removeItem('hasRenderedBefore');
  localStorage.removeItem('hasRenderedBeforeInvite');
  window.location.reload();
}

export default api;
