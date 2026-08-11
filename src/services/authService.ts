import {
  AUTH_ACCESS_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearSession,
  getStoredSession,
  saveSession,
} from '../guards/authStore';
import type { AuthSession, LoginCredentials, LoginResponse } from '../types/auth';
import { authClient } from './api/authClient';

const mapLoginResponseToSession = (response: LoginResponse): AuthSession => ({
  user: {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    image: response.image,
  },
  accessToken: response.accessToken,
  refreshToken: response.refreshToken,
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const { data } = await authClient.post<LoginResponse>('/auth/login', credentials);
    return mapLoginResponseToSession(data);
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

  getAccessToken: (): string | null => localStorage.getItem(AUTH_ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null => localStorage.getItem(AUTH_REFRESH_TOKEN_KEY),

  getStoredUserRaw: (): string | null => localStorage.getItem(AUTH_USER_KEY),
};
