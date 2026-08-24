import { SURVEY_API_IDS } from '../constants/survey';
import type { AppLanguage } from '../i18n/types';
import type { ApiResponse } from '../types/api';
import type { SurveySubmissionPayload } from '../types/survey';
import type { PaginatedSurveySubmissions, SurveyForm, SurveyStatistics } from '../types/surveyAdmin';
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

  getForms: async (): Promise<SurveyForm[]> => {
    const { data } = await apiClient.get<ApiResponse<SurveyForm[]>>('/surveys/forms');
    return data.data;
  },

  getSubmissions: async (
    formId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedSurveySubmissions> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedSurveySubmissions>>(
      `/surveys/${formId}/submissions`,
      {
        params: {
          pageNumber,
          pageSize,
        },
      },
    );

    return data.data;
  },

  getStatistics: async (formId: number): Promise<SurveyStatistics> => {
    const { data } = await apiClient.get<ApiResponse<SurveyStatistics>>(
      `/surveys/${formId}/statistics`,
    );

    return data.data;
  },
};
