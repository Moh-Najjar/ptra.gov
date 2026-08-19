import { SESSION_EXPIRY_WARNING_SECONDS } from '../constants/sessionExpiry';

const warningDurationMs = SESSION_EXPIRY_WARNING_SECONDS * 1000;

export const getExpiresAtMs = (expiresAt: string): number | null => {
  const parsed = Date.parse(expiresAt);
  return Number.isNaN(parsed) ? null : parsed;
};

export const getMillisecondsUntilExpiry = (expiresAt: string, nowMs = Date.now()): number | null => {
  const expiresAtMs = getExpiresAtMs(expiresAt);
  if (expiresAtMs === null) {
    return null;
  }

  return expiresAtMs - nowMs;
};

export const getMillisecondsUntilExpiryWarning = (
  expiresAt: string,
  nowMs = Date.now(),
): number => {
  const remainingMs = getMillisecondsUntilExpiry(expiresAt, nowMs);

  if (remainingMs === null) {
    return 0;
  }

  return remainingMs - warningDurationMs;
};

export const getExpiryCountdownSeconds = (expiresAt: string, nowMs = Date.now()): number => {
  const remainingMs = getMillisecondsUntilExpiry(expiresAt, nowMs);

  if (remainingMs === null || remainingMs <= 0) {
    return SESSION_EXPIRY_WARNING_SECONDS;
  }

  return Math.max(1, Math.min(SESSION_EXPIRY_WARNING_SECONDS, Math.ceil(remainingMs / 1000)));
};
