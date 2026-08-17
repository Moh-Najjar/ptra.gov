import { SURVEY_API_IDS } from '../constants/survey';
import type { AppLanguage } from '../i18n/types';
import type { ApiResponse } from '../types/api';
import type { SurveySubmissionPayload } from '../types/survey';
import { buildSurveyApiPayload } from '../utils/surveyPayload';
import { apiClient } from './api/client';

export const surveyService = {
  submitUserEvaluation: async (
    answers: SurveySubmissionPayload,
    language: AppLanguage,
  ): Promise<void> => {
    const surveyId = SURVEY_API_IDS[language];
    const payload = buildSurveyApiPayload(answers, language);

    await apiClient.post<ApiResponse<null>>(`/surveys/${surveyId}/submit`, payload);
  },
};
