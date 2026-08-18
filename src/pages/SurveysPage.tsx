import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState, type ChangeEvent, type MouseEvent, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
  getAdminTableInteractiveRowSx,
} from '../components/common/AdminTable';
import { SurveySubmissionDetailsDialog } from '../components/surveys/SurveySubmissionDetailsDialog';
import { useSurveyForms, useSurveySubmissions } from '../hooks/queries/surveyAdmin';
import type { SurveyForm, SurveySubmission } from '../types/surveyAdmin';

const DEFAULT_PAGE_SIZE = 20;

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

const renderOptionalValue = (value: string | null, fallback: string): string => {
  if (value === null || value.trim().length === 0) {
    return fallback;
  }

  return value;
};

export const SurveysPage = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-JO' : 'en-US';

  const { data: forms = [], isLoading: isFormsLoading, isError: isFormsError } = useSurveyForms();
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedSubmission, setSelectedSubmission] = useState<SurveySubmission | null>(null);

  const {
    data: submissionsData,
    isLoading: isSubmissionsLoading,
    isError: isSubmissionsError,
  } = useSurveySubmissions(selectedFormId, pageNumber, pageSize);

  const sortedForms = useMemo(
    () => [...forms].sort((first, second) => first.id - second.id),
    [forms],
  );

  const selectedForm: SurveyForm | null = useMemo(() => {
    if (selectedFormId === null) {
      return null;
    }

    return sortedForms.find((form) => form.id === selectedFormId) ?? null;
  }, [selectedFormId, sortedForms]);

  useEffect(() => {
    if (sortedForms.length === 0) {
      setSelectedFormId(null);
      return;
    }

    const selectedFormExists = sortedForms.some((form) => form.id === selectedFormId);
    if (selectedFormId === null || !selectedFormExists) {
      setSelectedFormId(sortedForms[0].id);
    }
  }, [selectedFormId, sortedForms]);

  const handleFormChange = (_event: SyntheticEvent, nextFormId: number) => {
    setSelectedFormId(nextFormId);
    setPageNumber(1);
    setSelectedSubmission(null);
  };

  const handlePageChange = (_event: MouseEvent<HTMLButtonElement> | null, nextPage: number) => {
    setPageNumber(nextPage + 1);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  };

  const openSubmissionDetails = (submission: SurveySubmission) => {
    setSelectedSubmission(submission);
  };

  const closeSubmissionDetails = () => {
    setSelectedSubmission(null);
  };

  const isLoading = isFormsLoading || (selectedFormId !== null && isSubmissionsLoading);
  const isError = isFormsError || isSubmissionsError;

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.surveys.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('pages.surveys.title')}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
        {t('pages.surveys.description')}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress aria-label={t('pages.surveys.loading')} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('pages.surveys.loadError')}
        </Alert>
      )}

      {!isLoading && !isError && sortedForms.length === 0 && (
        <Alert severity="info">{t('pages.surveys.noForms')}</Alert>
      )}

      {!isLoading && !isError && sortedForms.length > 0 && (
        <>
          <Tabs
            value={selectedFormId ?? sortedForms[0].id}
            onChange={handleFormChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            {sortedForms.map((form) => (
              <Tab
                key={form.id}
                value={form.id}
                label={form.title}
                icon={<RateReviewOutlinedIcon fontSize="small" />}
                iconPosition="start"
              />
            ))}
          </Tabs>

          {selectedForm && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('pages.surveys.selectedForm', { title: selectedForm.title })}
            </Typography>
          )}

          {submissionsData && submissionsData.items.length === 0 && (
            <Alert severity="info">{t('pages.surveys.noSubmissions')}</Alert>
          )}

          {submissionsData && submissionsData.items.length > 0 && (
            <AdminTableContainer>
              <Table>
                <TableHead>
                  <AdminTableHeadRow>
                    <AdminTableHeadCell>{t('pages.surveys.table.serialNumber')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.table.status')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.table.createdAt')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.table.browser')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.table.device')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.table.ip')}</AdminTableHeadCell>
                    <AdminTableHeadCell>{t('pages.surveys.table.sourceUrl')}</AdminTableHeadCell>
                    <AdminTableHeadCell align="center">
                      {t('pages.surveys.table.actions')}
                    </AdminTableHeadCell>
                  </AdminTableHeadRow>
                </TableHead>
                <TableBody>
                  {submissionsData.items.map((submission) => {
                    const isRead = submission.status === 'read';

                    return (
                      <TableRow
                        key={submission.id}
                        hover
                        sx={getAdminTableInteractiveRowSx(true)}
                        onClick={() => openSubmissionDetails(submission)}
                      >
                        <TableCell>{submission.serialNumber}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          {formatSubmissionDateTime(submission.createdAt, locale)}
                        </TableCell>
                        <TableCell>
                          {renderOptionalValue(submission.browser, t('pages.surveys.notAvailable'))}
                        </TableCell>
                        <TableCell>
                          {renderOptionalValue(submission.device, t('pages.surveys.notAvailable'))}
                        </TableCell>
                        <TableCell>{submission.ip}</TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Link
                            href={submission.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {submission.sourceUrl}
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={t('pages.surveys.table.viewDetails')}>
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label={t('pages.surveys.table.viewDetails')}
                              onClick={(event) => {
                                event.stopPropagation();
                                openSubmissionDetails(submission);
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={submissionsData.totalCount}
                page={Math.max(submissionsData.pageNumber - 1, 0)}
                rowsPerPage={submissionsData.pageSize}
                rowsPerPageOptions={[10, 20, 50]}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage={t('pages.surveys.pagination.rowsPerPage')}
                labelDisplayedRows={({ from, to, count }) =>
                  t('pages.surveys.pagination.displayedRows', { from, to, count })
                }
              />
            </AdminTableContainer>
          )}
        </>
      )}

      <SurveySubmissionDetailsDialog
        open={selectedSubmission !== null}
        submission={selectedSubmission}
        onClose={closeSubmissionDetails}
      />
    </Container>
  );
};
