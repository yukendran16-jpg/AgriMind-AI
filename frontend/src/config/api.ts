import axios from 'axios';

// Centralized Backend API Base URL Configuration
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/+$/, '');

// Create Axios Instance configured for production/development environment
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for inserting Auth JWT Bearer Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrimind_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
