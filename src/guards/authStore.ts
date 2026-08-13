import type { AuthSession, AuthUser } from '../types/auth';

export const AUTH_ACCESS_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';
export const AUTH_EXPIRES_AT_KEY = 'auth_expires_at';

const isAuthUser = (value: unknown): value is AuthUser => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;
  const hasValidRoles =
    Array.isArray(user.roles) && user.roles.every((role) => typeof role === 'string');

  return (
    typeof user.id === 'number' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string' &&
    typeof user.displayName === 'string' &&
    typeof user.fullName === 'string' &&
    typeof user.isAdmin === 'boolean' &&
    hasValidRoles
  );
};

export const getStoredSession = (): AuthSession | null => {
  const accessToken = localStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
  const expiresAt = localStorage.getItem(AUTH_EXPIRES_AT_KEY);
  const userRaw = localStorage.getItem(AUTH_USER_KEY);

  if (!accessToken || !expiresAt || !userRaw) {
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
      expiresAt,
    };
  } catch {
    return null;
  }
};

export const saveSession = (session: AuthSession): void => {
  localStorage.setItem(AUTH_ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(AUTH_EXPIRES_AT_KEY, session.expiresAt);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
};

export const clearSession = (): void => {
  localStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const isAuthenticated = (): boolean => getStoredSession() !== null;
