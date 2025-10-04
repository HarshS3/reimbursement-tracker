import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Inject token automatically if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('claimdoo_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;