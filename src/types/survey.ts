/** Likert-scale rating values (5 = most positive, 1 = most negative). */
export type SurveyRatingValue = 5 | 4 | 3 | 2 | 1;

export type SurveyQuestionId =
  | 'dataAccess'
  | 'accuracyComprehensiveness'
  | 'dashboardEffectiveness'
  | 'timeEffortSavings'
  | 'overallSatisfaction';

export type SurveyAnswers = Record<SurveyQuestionId, SurveyRatingValue | null>;

export interface SurveySubmissionPayload {
  dataAccess: SurveyRatingValue;
  accuracyComprehensiveness: SurveyRatingValue;
  dashboardEffectiveness: SurveyRatingValue;
  timeEffortSavings: SurveyRatingValue;
  overallSatisfaction: SurveyRatingValue;
}

export type SurveyDismissReason = 'notNow' | 'never';
