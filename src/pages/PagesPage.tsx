import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Container,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
  getAdminTableInteractiveRowSx,
} from '../components/common/AdminTable';
import { PageDetailsDialog } from '../components/pages/PageDetailsDialog';
import { getPagesTableLocale, usePages } from '../hooks/usePages';
import { useLanguage } from '../hooks/useLanguage';
import { pageHasDetails, type CmsPage } from '../types/cmsPage';

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
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);

  const renderLanguageCode = (languageCode: CmsPage['languageCode']): string => {
    if (languageCode === null || languageCode.trim().length === 0) {
      return t('pages.pages.table.notAvailable');
    }

    return languageCode.toUpperCase();
  };

  const openPageDetails = (page: CmsPage) => {
    if (!pageHasDetails(page)) {
      return;
    }

    setSelectedPage(page);
  };

  const closePageDetails = () => {
    setSelectedPage(null);
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
                <AdminTableHeadCell>{t('pages.pages.table.records')}</AdminTableHeadCell>
              </AdminTableHeadRow>
            </TableHead>
            <TableBody>
              {data.map((page) => {
                const isSelected = selectedPage?.id === page.id;
                const hasDetails = pageHasDetails(page);

                return (
                  <TableRow
                    key={page.id}
                    hover={hasDetails}
                    selected={isSelected}
                    sx={getAdminTableInteractiveRowSx(hasDetails)}
                    onClick={() => openPageDetails(page)}
                  >
                    <TableCell>{page.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 320 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {page.title}
                        </Typography>
                        {hasDetails && (
                          <TableRowsOutlinedIcon
                            fontSize="small"
                            color="primary"
                            aria-hidden="true"
                          />
                        )}
                      </Stack>
                    </TableCell>
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
                    <TableCell>
                      {hasDetails ? (
                        <Chip
                          icon={<TableRowsOutlinedIcon />}
                          label={t('pages.pages.table.viewRecords')}
                          size="small"
                          color="primary"
                          variant="outlined"
                          clickable
                          onClick={(event) => {
                            event.stopPropagation();
                            openPageDetails(page);
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('pages.pages.table.notAvailable')}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminTableContainer>
      )}

      <PageDetailsDialog
        page={selectedPage !== null && pageHasDetails(selectedPage) ? selectedPage : null}
        onClose={closePageDetails}
      />
    </Container>
  );
};
