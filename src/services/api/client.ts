import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { AUTH_UNAUTHORIZED_EVENT } from '../../constants/sessionExpiry';
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

// Request interceptor
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

const isLoginRequest = (config: InternalAxiosRequestConfig | undefined): boolean => {
  const requestUrl = config?.url ?? '';
  return /\/auth\/login/i.test(requestUrl);
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !isLoginRequest(error.config) &&
      localStorage.getItem('auth_token')
    ) {
      window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);
