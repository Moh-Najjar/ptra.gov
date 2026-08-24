export const surveyAdminKeys = {
  all: ['surveyAdmin'] as const,
  forms: () => [...surveyAdminKeys.all, 'forms'] as const,
  submissions: (formId: number, pageNumber: number, pageSize: number) =>
    [...surveyAdminKeys.all, 'submissions', formId, pageNumber, pageSize] as const,
  statistics: (formId: number) => [...surveyAdminKeys.all, 'statistics', formId] as const,
};
