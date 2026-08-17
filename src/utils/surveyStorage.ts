import {
  SURVEY_NEVER_DAYS,
  SURVEY_NOT_NOW_DAYS,
  SURVEY_STORAGE_KEYS,
} from '../constants/survey';
import type { SurveyDismissReason } from '../types/survey';

const getDismissDays = (reason: SurveyDismissReason): number =>
  reason === 'never' ? SURVEY_NEVER_DAYS : SURVEY_NOT_NOW_DAYS;

const addDays = (days: number): number => Date.now() + days * 24 * 60 * 60 * 1000;

export const isSurveySubmitted = (): boolean =>
  localStorage.getItem(SURVEY_STORAGE_KEYS.submitted) === 'true';

export const markSurveySubmitted = (): void => {
  localStorage.setItem(SURVEY_STORAGE_KEYS.submitted, 'true');
};

export const isSurveyDismissed = (): boolean => {
  const dismissedUntil = localStorage.getItem(SURVEY_STORAGE_KEYS.dismissedUntil);
  if (!dismissedUntil) {
    return false;
  }

  const dismissedUntilMs = Number(dismissedUntil);
  if (Number.isNaN(dismissedUntilMs)) {
    return false;
  }

  return Date.now() < dismissedUntilMs;
};

export const dismissSurvey = (reason: SurveyDismissReason): void => {
  const days = getDismissDays(reason);
  localStorage.setItem(SURVEY_STORAGE_KEYS.dismissedUntil, String(addDays(days)));
};

export const getSessionPageViews = (): number => {
  const value = sessionStorage.getItem(SURVEY_STORAGE_KEYS.sessionPageViews);
  if (!value) {
    return 0;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const incrementSessionPageViews = (): number => {
  const nextCount = getSessionPageViews() + 1;
  sessionStorage.setItem(SURVEY_STORAGE_KEYS.sessionPageViews, String(nextCount));
  return nextCount;
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

export const wasPromptShownThisSession = (): boolean =>
  sessionStorage.getItem(SURVEY_STORAGE_KEYS.promptShown) === 'true';

export const markPromptShownThisSession = (): void => {
  sessionStorage.setItem(SURVEY_STORAGE_KEYS.promptShown, 'true');
};

/** Clears survey prompt state so you can test the flow again. */
export const resetSurveyState = (): void => {
  localStorage.removeItem(SURVEY_STORAGE_KEYS.submitted);
  localStorage.removeItem(SURVEY_STORAGE_KEYS.dismissedUntil);
  sessionStorage.removeItem(SURVEY_STORAGE_KEYS.sessionPageViews);
  sessionStorage.removeItem(SURVEY_STORAGE_KEYS.sessionStartedAt);
  sessionStorage.removeItem(SURVEY_STORAGE_KEYS.promptShown);
};
