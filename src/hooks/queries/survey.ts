import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../../i18n/types';
import { surveyService } from '../../services/surveyService';
import type { SurveySubmissionPayload } from '../../types/survey';

export const useSubmitSurvey = () => {
  const { i18n } = useTranslation();

  return useMutation({
    mutationFn: (answers: SurveySubmissionPayload) =>
      surveyService.submitUserEvaluation(answers, i18n.language as AppLanguage),
  });
};
