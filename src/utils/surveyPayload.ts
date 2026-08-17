import {
  SURVEY_API_FIELD_KEYS,
  SURVEY_QUESTION_IDS,
  SURVEY_RATING_LABEL_KEYS,
} from '../constants/survey';
import i18n from '../i18n';
import type { AppLanguage } from '../i18n/types';
import type { SurveyApiPayload, SurveySubmissionPayload } from '../types/survey';

const DEFAULT_SOURCE_ORIGIN = 'https://ptra.gov.jo';

export const getSurveySourceUrl = (language: AppLanguage): string => {
  const origin =
    typeof window !== 'undefined' && window.location.origin.length > 0
      ? window.location.origin
      : DEFAULT_SOURCE_ORIGIN;

  if (language === 'en') {
    return `${origin}/?lang=en`;
  }

  return `${origin}/`;
};

export const buildSurveyApiPayload = (
  answers: SurveySubmissionPayload,
  language: AppLanguage,
): SurveyApiPayload => {
  const translate = i18n.getFixedT(language);

  return {
    sourceUrl: getSurveySourceUrl(language),
    answers: SURVEY_QUESTION_IDS.map((questionId) => ({
      key: SURVEY_API_FIELD_KEYS[questionId],
      value: translate(SURVEY_RATING_LABEL_KEYS[answers[questionId]]),
    })),
  };
};
