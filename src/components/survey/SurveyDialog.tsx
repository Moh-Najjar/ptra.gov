import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SURVEY_QUESTION_IDS,
  SURVEY_QUESTION_LABEL_KEYS,
  SURVEY_RATING_LABEL_KEYS,
  SURVEY_RATING_OPTIONS,
} from '../../constants/survey';
import { useSubmitSurvey } from '../../hooks/queries/survey';
import { useSurvey } from '../../contexts/SurveyContext';
import type {
  SurveyAnswers,
  SurveyQuestionId,
  SurveyRatingValue,
  SurveySubmissionPayload,
} from '../../types/survey';
import { markSurveySubmitted } from '../../utils/surveyStorage';
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogPrimaryButton,
} from '../common/AdminDialog';

const createEmptyAnswers = (): SurveyAnswers => ({
  dataAccess: null,
  accuracyComprehensiveness: null,
  dashboardEffectiveness: null,
  timeEffortSavings: null,
  overallSatisfaction: null,
});

const isCompletePayload = (answers: SurveyAnswers): answers is SurveySubmissionPayload =>
  SURVEY_QUESTION_IDS.every((questionId) => answers[questionId] !== null);

interface SurveyDialogProps {
  onSubmitted?: () => void;
}

export const SurveyDialog = ({ onSubmitted }: SurveyDialogProps) => {
  const { t } = useTranslation();
  const { isDialogOpen, closeSurvey } = useSurvey();
  const submitSurvey = useSubmitSurvey();
  const [answers, setAnswers] = useState<SurveyAnswers>(createEmptyAnswers);
  const [validationError, setValidationError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const resetForm = useCallback(() => {
    setAnswers(createEmptyAnswers());
    setValidationError(false);
    setSubmitSuccess(false);
    submitSurvey.reset();
  }, [submitSurvey]);

  const handleClose = useCallback(() => {
    closeSurvey();
    resetForm();
  }, [closeSurvey, resetForm]);

  const handleAnswerChange = useCallback(
    (questionId: SurveyQuestionId, value: string) => {
      const parsedValue = Number(value);
      if (parsedValue !== 1 && parsedValue !== 2 && parsedValue !== 3 && parsedValue !== 4 && parsedValue !== 5) {
        return;
      }

      setAnswers((current) => ({
        ...current,
        [questionId]: parsedValue as SurveyRatingValue,
      }));
      setValidationError(false);
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!isCompletePayload(answers)) {
      setValidationError(true);
      return;
    }

    try {
      await submitSurvey.mutateAsync(answers);
      markSurveySubmitted();
      setSubmitSuccess(true);
      onSubmitted?.();
    } catch {
      setSubmitSuccess(false);
    }
  }, [answers, onSubmitted, submitSurvey]);

  const dialogTitle = useMemo(() => t('survey.title'), [t]);

  return (
    <AdminDialog
      open={isDialogOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="survey-dialog-title"
    >
      <AdminDialogHeader
        title={dialogTitle}
        icon={RateReviewOutlinedIcon}
        onClose={handleClose}
        closeLabel={t('survey.close')}
        closeDisabled={submitSurvey.isPending}
      />

      <AdminDialogContent>
        {submitSuccess ? (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            {t('survey.submitSuccess')}
          </Alert>
        ) : (
          <Stack spacing={3}>
            {validationError && (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                {t('survey.validationError')}
              </Alert>
            )}

            {submitSurvey.isError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {t('survey.submitError')}
              </Alert>
            )}

            {SURVEY_QUESTION_IDS.map((questionId) => (
              <Box
                key={questionId}
                sx={{
                  pb: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-of-type': {
                    borderBottom: 'none',
                    pb: 0,
                  },
                }}
              >
                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{
                      mb: 1.5,
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      '&.Mui-focused': { color: 'text.secondary' },
                    }}
                  >
                    {t(SURVEY_QUESTION_LABEL_KEYS[questionId])}
                  </FormLabel>

                  <RadioGroup
                    row
                    value={answers[questionId] ?? ''}
                    onChange={(event) => handleAnswerChange(questionId, event.target.value)}
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: { xs: 0.5, sm: 1 },
                      justifyContent: { xs: 'flex-start', md: 'space-between' },
                    }}
                  >
                    {SURVEY_RATING_OPTIONS.map((rating) => (
                      <FormControlLabel
                        key={`${questionId}-${rating}`}
                        value={String(rating)}
                        control={<Radio size="small" />}
                        label={
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            {t(SURVEY_RATING_LABEL_KEYS[rating])}
                          </Typography>
                        }
                        sx={{
                          m: 0,
                          mr: { xs: 1, sm: 1.5 },
                          alignItems: 'center',
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
          </Stack>
        )}
      </AdminDialogContent>

      <AdminDialogFooter>
        {submitSuccess ? (
          <AdminDialogPrimaryButton onClick={handleClose}>
            {t('survey.close')}
          </AdminDialogPrimaryButton>
        ) : (
          <>
            <AdminDialogCancelButton onClick={handleClose} disabled={submitSurvey.isPending}>
              {t('survey.cancel')}
            </AdminDialogCancelButton>
            <AdminDialogPrimaryButton
              onClick={handleSubmit}
              disabled={submitSurvey.isPending}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.92),
              }}
            >
              {submitSurvey.isPending ? t('survey.submitting') : t('survey.submit')}
            </AdminDialogPrimaryButton>
          </>
        )}
      </AdminDialogFooter>
    </AdminDialog>
  );
};
