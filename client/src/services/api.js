import axios from 'axios';

// In production (Vercel), API is on same domain, so use relative URL
// In development, use localhost
// Can override with VITE_API_URL env var
const BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? '/api' // Same domain on Vercel
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
export { BASE_URL };
