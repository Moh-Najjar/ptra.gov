import type { ApiResponse } from '../types/api';
import type { SurveySubmissionPayload } from '../types/survey';
import { apiClient } from './api/client';

export const surveyService = {
  submitUserEvaluation: async (payload: SurveySubmissionPayload): Promise<void> => {
    await apiClient.post<ApiResponse<null>>('/Surveys/user-evaluation', payload);
  },
};
