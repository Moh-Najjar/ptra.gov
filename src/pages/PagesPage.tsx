import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
} from '../components/common/AdminTable';
import { getPagesTableLocale, usePages } from '../hooks/queries/usePages';
import { useLanguage } from '../hooks/useLanguage';
import type { CmsPage } from '../types/cmsPage';

const formatDateTime = (value: string, locale: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const getStatusColor = (
  status: string,
): 'success' | 'default' | 'warning' | 'info' => {
  switch (status) {
    case 'publish':
      return 'success';
    case 'auto-draft':
    case 'draft':
      return 'warning';
    case 'pending':
      return 'info';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string, t: (key: string) => string): string => {
  const translationKey = `pages.pages.status.${status}`;
  const translated = t(translationKey);
  return translated === translationKey ? status : translated;
};

export const PagesPage = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data, isLoading, isError } = usePages();
  const tableLocale = getPagesTableLocale(language);

  const renderLanguageCode = (languageCode: CmsPage['languageCode']): string => {
    if (languageCode === null || languageCode.trim().length === 0) {
      return t('pages.pages.table.notAvailable');
    }

    return languageCode.toUpperCase();
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.pages.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        {t('pages.pages.title')}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
        {t('pages.pages.description')}
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress aria-label={t('pages.pages.loading')} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('pages.pages.loadError')}
        </Alert>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <Alert severity="info">{t('pages.pages.noData')}</Alert>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <AdminTableContainer>
          <Table aria-label={t('pages.pages.title')}>
            <TableHead>
              <AdminTableHeadRow>
                <AdminTableHeadCell>{t('pages.pages.table.id')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.title')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.status')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.publishedDate')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.modifiedDate')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.language')}</AdminTableHeadCell>
              </AdminTableHeadRow>
            </TableHead>
            <TableBody>
              {data.map((page) => (
                <TableRow key={page.id} hover>
                  <TableCell>{page.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{page.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(page.status, t)}
                      color={getStatusColor(page.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDateTime(page.publishedDate, tableLocale)}</TableCell>
                  <TableCell>{formatDateTime(page.modifiedDate, tableLocale)}</TableCell>
                  <TableCell>{renderLanguageCode(page.languageCode)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableContainer>
      )}
    </Container>
  );
};
