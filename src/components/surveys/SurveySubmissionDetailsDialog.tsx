import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import {
  Box,
  Chip,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SurveySubmission } from '../../types/surveyAdmin';
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogSection,
} from '../common/AdminDialog';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
} from '../common/AdminTable';

interface SurveySubmissionDetailsDialogProps {
  open: boolean;
  submission: SurveySubmission | null;
  onClose: () => void;
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

  const isRead = submission.status === 'read';

  return (
    <AdminDialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <AdminDialogHeader
        title={t('pages.surveys.details.title', { serialNumber: submission.serialNumber })}
        subtitle={submission.formTitle}
        icon={RateReviewOutlinedIcon}
        onClose={onClose}
        closeLabel={t('pages.surveys.details.close')}
        action={
          <Chip
            size="small"
            label={
              isRead
                ? t('pages.surveys.status.read')
                : t('pages.surveys.status.unread')
            }
            color={isRead ? 'default' : 'warning'}
            sx={{ fontWeight: 700 }}
          />
        }
      />

      <AdminDialogContent>
        <Stack spacing={2.5}>
          <AdminDialogSection title={t('pages.surveys.details.metadata')}>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {`${t('pages.surveys.table.createdAt')}: `}
                </Box>
                {formatSubmissionDateTime(submission.createdAt, locale)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {`${t('pages.surveys.table.sourceUrl')}: `}
                </Box>
                <Link href={submission.sourceUrl} target="_blank" rel="noopener noreferrer" underline="hover">
                  {submission.sourceUrl}
                </Link>
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {`${t('pages.surveys.table.browser')}: `}
                </Box>
                {renderMetadataValue(submission.browser, t('pages.surveys.notAvailable'))}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {`${t('pages.surveys.table.device')}: `}
                </Box>
                {renderMetadataValue(submission.device, t('pages.surveys.notAvailable'))}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {`${t('pages.surveys.table.ip')}: `}
                </Box>
                {submission.ip}
              </Typography>
            </Stack>
          </AdminDialogSection>

          <AdminDialogSection title={t('pages.surveys.details.answers')}>
            <AdminTableContainer>
              <Table size="small">
                <TableHead>
                  <AdminTableHeadRow>
                    <AdminTableHeadCell>{t('pages.surveys.details.question')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.details.answer')}</AdminTableHeadCell>
                  </AdminTableHeadRow>
                </TableHead>
                <TableBody>
                  {submission.answers.map((answer) => (
                    <TableRow key={`${submission.id}-${answer.key}`}>
                      <TableCell sx={{ fontWeight: 600, maxWidth: 320 }}>
                        {answer.label}
                      </TableCell>
                      <TableCell>
                        {answer.value.trim().length > 0
                          ? answer.value
                          : t('pages.surveys.notAvailable')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AdminTableContainer>
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
