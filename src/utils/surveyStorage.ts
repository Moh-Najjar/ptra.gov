import { SURVEY_STORAGE_KEYS } from '../constants/survey';

export const isSurveySubmitted = (): boolean =>
  localStorage.getItem(SURVEY_STORAGE_KEYS.submitted) === 'true';

export const markSurveySubmitted = (): void => {
  localStorage.setItem(SURVEY_STORAGE_KEYS.submitted, 'true');
  clearSoftCloseState();
};

export const getSessionPageViews = (): number => {
  const value = sessionStorage.getItem(SURVEY_STORAGE_KEYS.sessionPageViews);
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setSessionPageViews = (count: number): void => {
  sessionStorage.setItem(SURVEY_STORAGE_KEYS.sessionPageViews, String(count));
};

export const getSessionStartedAt = (): number => {
  const stored = sessionStorage.getItem(SURVEY_STORAGE_KEYS.sessionStartedAt);
  if (stored) {
    const parsed = Number(stored);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  const startedAt = Date.now();
  sessionStorage.setItem(SURVEY_STORAGE_KEYS.sessionStartedAt, String(startedAt));
  return startedAt;
};

export const getSoftClosedAt = (): number | null => {
  const stored = localStorage.getItem(SURVEY_STORAGE_KEYS.softClosedAt);
  if (!stored) {
    return null;
  }

  const parsed = Number(stored);
  return Number.isNaN(parsed) ? null : parsed;
};

export const getPagesSinceClose = (): number => {
  const value = localStorage.getItem(SURVEY_STORAGE_KEYS.pagesSinceClose);
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const setPagesSinceClose = (count: number): void => {
  localStorage.setItem(SURVEY_STORAGE_KEYS.pagesSinceClose, String(count));
};

const getLastCountedPathname = (): string | null =>
  sessionStorage.getItem(SURVEY_STORAGE_KEYS.lastCountedPathname);

const setLastCountedPathname = (pathname: string): void => {
  sessionStorage.setItem(SURVEY_STORAGE_KEYS.lastCountedPathname, pathname);
};

/**
 * Counts a page view only when the pathname actually changes.
 * Skips refresh / Strict Mode remounts of the same route.
 */
export const trackSurveyPageView = (pathname: string): void => {
  const lastPathname = getLastCountedPathname();
  if (lastPathname === pathname) {
    return;
  }

  setLastCountedPathname(pathname);
  setSessionPageViews(getSessionPageViews() + 1);
  getSessionStartedAt();

  if (hasSoftClosePending()) {
    setPagesSinceClose(getPagesSinceClose() + 1);
  }
};

/** Marks a non-submit close so the prompt can reappear after the re-show delay or page views. */
export const markSurveySoftClosed = (): void => {
  localStorage.setItem(SURVEY_STORAGE_KEYS.softClosedAt, String(Date.now()));
  localStorage.setItem(SURVEY_STORAGE_KEYS.pagesSinceClose, '0');
};

export const clearSoftCloseState = (): void => {
  localStorage.removeItem(SURVEY_STORAGE_KEYS.softClosedAt);
  localStorage.removeItem(SURVEY_STORAGE_KEYS.pagesSinceClose);
};

export const hasSoftClosePending = (): boolean => getSoftClosedAt() !== null;

/** Clears survey prompt state so you can test the flow again. */
export const resetSurveyState = (): void => {
  localStorage.removeItem(SURVEY_STORAGE_KEYS.submitted);
  sessionStorage.removeItem(SURVEY_STORAGE_KEYS.sessionPageViews);
  sessionStorage.removeItem(SURVEY_STORAGE_KEYS.sessionStartedAt);
  sessionStorage.removeItem(SURVEY_STORAGE_KEYS.lastCountedPathname);
  clearSoftCloseState();
};
