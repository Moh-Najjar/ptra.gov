import { useQuery } from '@tanstack/react-query';
import { surveyService } from '../../services/surveyService';
import { surveyAdminKeys } from './surveyAdminKeys';

export const useSurveyForms = () =>
  useQuery({
    queryKey: surveyAdminKeys.forms(),
    queryFn: () => surveyService.getForms(),
  });

export const useSurveySubmissions = (
  formId: number | null,
  pageNumber: number,
  pageSize: number,
) =>
  useQuery({
    queryKey: surveyAdminKeys.submissions(formId ?? 0, pageNumber, pageSize),
    queryFn: () => surveyService.getSubmissions(formId as number, pageNumber, pageSize),
    enabled: formId !== null,
  });

export const useSurveyStatistics = (formId: number | null) =>
  useQuery({
    queryKey: surveyAdminKeys.statistics(formId ?? 0),
    queryFn: () => surveyService.getStatistics(formId as number),
    enabled: formId !== null,
  });
