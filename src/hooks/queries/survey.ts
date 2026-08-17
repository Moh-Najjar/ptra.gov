import { useMutation } from '@tanstack/react-query';
import { surveyService } from '../../services/surveyService';
import type { SurveySubmissionPayload } from '../../types/survey';

export const useSubmitSurvey = () =>
  useMutation({
    mutationFn: (payload: SurveySubmissionPayload) =>
      surveyService.submitUserEvaluation(payload),
  });
