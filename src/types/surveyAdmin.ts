export interface SurveyFormQuestion {
  key: string;
  label: string;
  options: string[];
}

export interface SurveyForm {
  id: number;
  title: string;
  status: string;
  questions: SurveyFormQuestion[];
}

export interface SurveySubmissionAnswer {
  key: string;
  label: string;
  value: string;
}

export interface SurveySubmission {
  id: number;
  formId: number;
  formTitle: string;
  serialNumber: number;
  sourceUrl: string;
  browser: string | null;
  device: string | null;
  ip: string;
  createdAt: string;
  answers: SurveySubmissionAnswer[];
}

export interface PaginatedSurveySubmissions {
  items: SurveySubmission[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SurveyRatingStat {
  value: string;
  score: number;
  count: number;
  percentage: number;
}

export interface SurveyQuestionStat {
  key: string;
  label: string;
  totalAnswers: number;
  averageScore: number;
  ratings: SurveyRatingStat[];
}

export interface SurveyStatistics {
  formId: number;
  formTitle: string;
  totalSubmissions: number;
  overallAverageScore: number;
  questions: SurveyQuestionStat[];
}
