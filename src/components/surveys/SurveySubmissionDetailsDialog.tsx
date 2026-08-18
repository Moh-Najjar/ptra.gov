import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import WebOutlinedIcon from '@mui/icons-material/WebOutlined';
import { Box, Chip, Grid, Link, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import type { SurveySubmission } from '../../types/surveyAdmin';
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogSection,
  adminDialogSectionSx,
} from '../common/AdminDialog';

interface SurveySubmissionDetailsDialogProps {
  open: boolean;
  submission: SurveySubmission | null;
  onClose: () => void;
}

interface MetadataItemProps {
  icon: typeof CalendarTodayOutlinedIcon;
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

const formatSubmissionDateTime = (value: string, locale: string): string => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsedDate);
};

const renderMetadataValue = (value: string | null, fallback: string): string => {
  if (value === null || value.trim().length === 0) {
    return fallback;
  }

  return value;
};

const MetadataItem = ({ icon: Icon, label, value, isLink = false, href }: MetadataItemProps) => (
  <Box sx={adminDialogSectionSx}>
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 1.5,
          flexShrink: 0,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        {isLink && href ? (
          <Link href={href} target="_blank" rel="noopener noreferrer" underline="hover" variant="body2">
            {value}
          </Link>
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
            {value}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

export const SurveySubmissionDetailsDialog = ({
  open,
  submission,
  onClose,
}: SurveySubmissionDetailsDialogProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-JO' : 'en-US';

  if (!submission) {
    return null;
  }

  return (
    <AdminDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <AdminDialogHeader
        title={t('pages.surveys.details.title', { serialNumber: submission.serialNumber })}
        subtitle={t('survey.title')}
        icon={RateReviewOutlinedIcon}
        onClose={onClose}
        closeLabel={t('pages.surveys.details.close')}
      />

      <AdminDialogContent>
        <Stack spacing={3}>
          <AdminDialogSection title={t('pages.surveys.details.metadata')}>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetadataItem
                  icon={CalendarTodayOutlinedIcon}
                  label={t('pages.surveys.table.createdAt')}
                  value={formatSubmissionDateTime(submission.createdAt, locale)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetadataItem
                  icon={PublicOutlinedIcon}
                  label={t('pages.surveys.table.ip')}
                  value={submission.ip}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetadataItem
                  icon={WebOutlinedIcon}
                  label={t('pages.surveys.table.browser')}
                  value={renderMetadataValue(submission.browser, t('pages.surveys.notAvailable'))}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetadataItem
                  icon={ComputerOutlinedIcon}
                  label={t('pages.surveys.table.device')}
                  value={renderMetadataValue(submission.device, t('pages.surveys.notAvailable'))}
                />
              </Grid>
              <Grid size={12}>
                <MetadataItem
                  icon={LanguageOutlinedIcon}
                  label={t('pages.surveys.table.sourceUrl')}
                  value={submission.sourceUrl}
                  isLink
                  href={submission.sourceUrl}
                />
              </Grid>
            </Grid>
          </AdminDialogSection>

          <AdminDialogSection title={t('pages.surveys.details.answers')}>
            <Stack spacing={1.5}>
              {submission.answers.map((answer, index) => {
                const answerValue =
                  answer.value.trim().length > 0 ? answer.value : t('pages.surveys.notAvailable');
                const hasAnswer = answer.value.trim().length > 0;

                return (
                  <Box
                    key={`${submission.id}-${answer.key}`}
                    sx={{
                      ...adminDialogSectionSx,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      justifyContent: 'space-between',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                        {`${t('pages.surveys.details.question')} ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                        {answer.label}
                      </Typography>
                    </Box>
                    <Chip
                      label={answerValue}
                      color={hasAnswer ? 'primary' : 'default'}
                      variant={hasAnswer ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 700,
                        maxWidth: { xs: '100%', sm: 220 },
                        height: 'auto',
                        '& .MuiChip-label': {
                          whiteSpace: 'normal',
                          py: 0.75,
                          lineHeight: 1.4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </AdminDialogSection>
        </Stack>
      </AdminDialogContent>

      <AdminDialogFooter>
        <AdminDialogCancelButton onClick={onClose}>
          {t('pages.surveys.details.close')}
        </AdminDialogCancelButton>
      </AdminDialogFooter>
    </AdminDialog>
  );
};
