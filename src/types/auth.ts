export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginApiData {
  token: string;
  expiresAt: string;
  userId: number;
  username: string;
  displayName: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
  roles: string[];
  forms: unknown[];
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName: string;
  fullName: string;
  isAdmin: boolean;
  roles: string[];
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresAt: string;
}
