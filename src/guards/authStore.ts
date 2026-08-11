import type { AuthSession, AuthUser } from '../types/auth';

export const AUTH_ACCESS_TOKEN_KEY = 'auth_token';
export const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';
export const AUTH_USER_KEY = 'auth_user';

const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.accessToken === 'undefined'
  );
};

export const getStoredSession = (): AuthSession | null => {
  const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(AUTH_REFRESH_TOKEN_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);

  if (!accessToken || !refreshToken || !userRaw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(userRaw);
    if (!isAuthUser(parsed)) {
      return null;
    }
    return {
      user: parsed,
      accessToken,
      refreshToken,
    };
  } catch {
    return null;
  }
};

export const saveSession = (session: AuthSession): void => {
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
};

export const clearSession = (): void => {
  localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = (): boolean => getStoredSession() !== null;
