import type { ApiResponse } from '../types/api';
import type { AuthSession, LoginApiData, LoginCredentials } from '../types/auth';
import { apiClient } from './api/client';
import {
  clearSession,
  getStoredSession,
  saveSession,
} from '../guards/authStore';

const mapLoginDataToSession = (data: LoginApiData): AuthSession => ({
  user: {
    id: data.userId,
    username: data.username,
    email: data.email,
    displayName: data.displayName,
    fullName: data.fullName,
    isAdmin: data.isAdmin,
    roles: data.roles,
  },
  accessToken: data.token,
  expiresAt: data.expiresAt,
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const { data } = await apiClient.post<ApiResponse<LoginApiData>>('/Auth/login', credentials);
    return mapLoginDataToSession(data.data);
  },

  getStoredSession,

  persistSession: (session: AuthSession): AuthSession => {
    saveSession(session);
    return session;
  },

  logout: (): null => {
    clearSession();
    return null;
  },

  getAccessToken: (): string | null => localStorage.getItem('auth_token'),
};
