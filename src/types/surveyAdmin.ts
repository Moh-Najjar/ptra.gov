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

export type SurveySubmissionStatus = 'read' | 'unread' | string;

export interface SurveySubmission {
  id: number;
  formId: number;
  formTitle: string;
  serialNumber: number;
  status: SurveySubmissionStatus;
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
