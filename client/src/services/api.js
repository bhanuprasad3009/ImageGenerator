import axios from 'axios';

// Get API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token in headers automatically and handle duplicate /api prefixes
api.interceptors.request.use(
  (config) => {
    // If url starts with /api/ and baseURL ends with /api, remove the duplicate prefix
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.substring(4); // removes '/api'
    }
    const token = localStorage.getItem('aetherart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
