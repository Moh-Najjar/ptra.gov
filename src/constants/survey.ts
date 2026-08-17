import { ROUTES } from '../app/routes/paths';
import type { SurveyQuestionId, SurveyRatingValue } from '../types/survey';

export const SURVEY_ID = 'user-evaluation-v1';

/** Minimum time on site (ms) before the prompt can appear. */
export const SURVEY_MIN_TIME_MS = 45_000;

/** Minimum page views in the current session before the prompt can appear. */
export const SURVEY_MIN_PAGE_VIEWS = 2;

/** Days to hide the prompt after "Not now". */
export const SURVEY_NOT_NOW_DAYS = 7;

/** Days to hide the prompt after "Don't ask again". */
export const SURVEY_NEVER_DAYS = 90;

export const SURVEY_STORAGE_KEYS = {
  submitted: `ptra_survey_${SURVEY_ID}_submitted`,
  dismissedUntil: `ptra_survey_${SURVEY_ID}_dismissed_until`,
  sessionPageViews: `ptra_survey_${SURVEY_ID}_page_views`,
  sessionStartedAt: `ptra_survey_${SURVEY_ID}_session_started`,
  promptShown: `ptra_survey_${SURVEY_ID}_prompt_shown`,
} as const;

/** Public routes only — surveys are not shown on admin/account pages. */
export const SURVEY_EXCLUDED_ROUTES: string[] = [
  ROUTES.MY_ACCOUNT,
  ROUTES.POST,
  ROUTES.PAGES,
  ROUTES.USERS,
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
