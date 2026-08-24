import { ROUTES } from '../app/routes/paths';
import type { AppLanguage } from '../i18n/types';
import type { SurveyQuestionId, SurveyRatingValue } from '../types/survey';

export const SURVEY_ID = 'user-evaluation-v1';

/** Backend survey IDs per language. */
export const SURVEY_API_IDS: Record<AppLanguage, number> = {
  ar: 3,
  en: 4,
};

/** Maps each question to the API field key expected by the backend. */
export const SURVEY_API_FIELD_KEYS: Record<SurveyQuestionId, string> = {
  dataAccess: 'input_radio',
  accuracyComprehensiveness: 'input_radio_4',
  dashboardEffectiveness: 'input_radio_3',
  timeEffortSavings: 'input_radio_2',
  overallSatisfaction: 'input_radio_1',
};

/** Minimum time on site (ms) before the prompt can appear the first time. */
export const SURVEY_MIN_TIME_MS = 60_000;

/** Minimum page views before the prompt can appear the first time. */
export const SURVEY_MIN_PAGE_VIEWS = 2;

/** After any close (without submit), re-show after this delay. */
export const SURVEY_RESHOW_AFTER_CLOSE_MS = 180_000;

/** After any close (without submit), re-show after this many page views. */
export const SURVEY_RESHOW_PAGE_VIEWS = 3;

export const SURVEY_STORAGE_KEYS = {
  submitted: `ptra_survey_${SURVEY_ID}_submitted`,
  sessionPageViews: `ptra_survey_${SURVEY_ID}_page_views`,
  sessionStartedAt: `ptra_survey_${SURVEY_ID}_session_started`,
  softClosedAt: `ptra_survey_${SURVEY_ID}_soft_closed_at`,
  pagesSinceClose: `ptra_survey_${SURVEY_ID}_pages_since_close`,
  lastCountedPathname: `ptra_survey_${SURVEY_ID}_last_counted_pathname`,
} as const;

/** Public routes only — surveys are not shown on admin/account pages. */
export const SURVEY_EXCLUDED_ROUTES: string[] = [
  ROUTES.MY_ACCOUNT,
  ROUTES.POST,
  ROUTES.PAGES,
  ROUTES.USERS,
  ROUTES.SURVEYS,
];

export const SURVEY_QUESTION_IDS: SurveyQuestionId[] = [
  'dataAccess',
  'accuracyComprehensiveness',
  'dashboardEffectiveness',
  'timeEffortSavings',
  'overallSatisfaction',
];

export const SURVEY_RATING_OPTIONS: SurveyRatingValue[] = [5, 4, 3, 2, 1];

export const SURVEY_RATING_LABEL_KEYS: Record<SurveyRatingValue, string> = {
  5: 'survey.ratings.verySatisfied',
  4: 'survey.ratings.satisfied',
  3: 'survey.ratings.neutral',
  2: 'survey.ratings.dissatisfied',
  1: 'survey.ratings.veryDissatisfied',
};

export const SURVEY_QUESTION_LABEL_KEYS: Record<SurveyQuestionId, string> = {
  dataAccess: 'survey.questions.dataAccess',
  accuracyComprehensiveness: 'survey.questions.accuracyComprehensiveness',
  dashboardEffectiveness: 'survey.questions.dashboardEffectiveness',
  timeEffortSavings: 'survey.questions.timeEffortSavings',
  overallSatisfaction: 'survey.questions.overallSatisfaction',
};
