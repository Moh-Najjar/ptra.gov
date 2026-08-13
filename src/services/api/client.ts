import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getStoredLanguage } from '../../i18n/types';

const apiBaseUrl = import.meta.env.VITE_BASE_URL;

if (typeof apiBaseUrl !== 'string' || apiBaseUrl.length === 0) {
  throw new Error('VITE_BASE_URL is missing. Add it to your .env file.');
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers) {
      config.headers['Accept-Language'] = getStoredLanguage();
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // TODO: redirect to login or refresh token when auth is implemented
    }
    return Promise.reject(error);
  },
);
