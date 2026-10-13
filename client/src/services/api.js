import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinewave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired and not on login/signup, clean storage
      const isAuthUrl = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/signup');
      if (!isAuthUrl && localStorage.getItem('cinewave_token')) {
        console.warn('Session expired or unauthorized. Clearing credentials.');
        localStorage.removeItem('cinewave_token');
        localStorage.removeItem('cinewave_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const videoAPI = {
  getVideos: (params) => api.get('/videos', { params }),
  getFeatured: () => api.get('/videos/featured'),
  getVideoById: (id) => api.get(`/videos/${id}`),
  recordView: (id) => api.post(`/videos/${id}/view`),
  checkAccess: (id) => api.get(`/videos/${id}/access`),
};

export const creatorAPI = {
  getVideos: () => api.get('/creator/videos'),
  createVideo: (data) => api.post('/creator/videos', data),
  updateVideo: (id, data) => api.put(`/creator/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/creator/videos/${id}`),
};

export const watchlistAPI = {
  getWatchlist: () => api.get('/watchlist'),
  toggle: (videoId) => api.post(`/watchlist/toggle/${videoId}`),
  check: (videoId) => api.get(`/watchlist/check/${videoId}`),
};

export const paymentAPI = {
  createOrder: () => api.post('/payment/create-order'),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getStatus: () => api.get('/payment/status'),
  getHistory: () => api.get('/payment/history'),
};

export default api;
