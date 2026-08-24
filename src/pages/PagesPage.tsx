import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Link,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogDangerButton,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogSection,
} from '../components/common/AdminDialog';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
  getAdminTableInteractiveRowSx,
} from '../components/common/AdminTable';
import { PageAuthorsDialog } from '../components/pages/PageAuthorsDialog';
import { PageDetailsDialog } from '../components/pages/PageDetailsDialog';
import { PageFormDialog } from '../components/pages/PageFormDialog';
import { USER_ROLES } from '../constants/userRoles';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import {
  getPagesTableLocale,
  useCreatePage,
  useDeletePage,
  usePages,
  useUpdatePage,
} from '../hooks/usePages';
import {
  buildPagePayload,
  createEmptyPageFormValues,
  formatPageAuthors,
  isPageFormValid,
  mapCmsPageToFormValues,
  pageHasDetails,
  type CmsPage,
  type PageFormValues,
} from '../types/cmsPage';
import { getApiErrorMessage } from '../utils/apiErrors';
import { userHasAnyRole } from '../utils/roles';

type PageDialogMode = 'add' | 'edit';

interface PageNotice {
  severity: 'success' | 'error';
  message: string;
}

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
  const { user } = useAuth();
  const { data, isLoading, isError } = usePages();
  const createPageMutation = useCreatePage();
  const updatePageMutation = useUpdatePage();
  const deletePageMutation = useDeletePage();
  const tableLocale = getPagesTableLocale(language);

  const [detailsPage, setDetailsPage] = useState<CmsPage | null>(null);
  const [authorsPage, setAuthorsPage] = useState<CmsPage | null>(null);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [formMode, setFormMode] = useState<PageDialogMode>('add');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState<PageFormValues>(createEmptyPageFormValues());
  const [notice, setNotice] = useState<PageNotice | null>(null);

  const canManagePages = userHasAnyRole(user, [
    USER_ROLES.ADMINISTRATOR,
    USER_ROLES.AUTHOR,
  ]);
  const canManageAuthors = userHasAnyRole(user, [USER_ROLES.ADMINISTRATOR]);
  const isSaving =
    createPageMutation.isPending ||
    updatePageMutation.isPending ||
    deletePageMutation.isPending;

  const renderLanguageCode = (languageCode: CmsPage['languageCode']): string => {
    if (languageCode === null || languageCode.trim().length === 0) {
      return t('pages.pages.table.notAvailable');
    }

    return languageCode.toUpperCase();
  };

  const renderAuthorsSummary = (page: CmsPage): string => {
    const authorsText = formatPageAuthors(page.authors);
    if (authorsText.length === 0) {
      return t('pages.pages.table.notAvailable');
    }

    return authorsText;
  };

  const openPageDetails = (page: CmsPage) => {
    if (!pageHasDetails(page)) {
      return;
    }

    setDetailsPage(page);
  };

  const closePageDetails = () => {
    setDetailsPage(null);
  };

  const openAddDialog = () => {
    setFormMode('add');
    setSelectedPage(null);
    setFormValues(createEmptyPageFormValues());
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (page: CmsPage) => {
    setFormMode('edit');
    setSelectedPage(page);
    setFormValues(mapCmsPageToFormValues(page));
    setIsFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedPage(null);
    setFormValues(createEmptyPageFormValues());
  };

  const openDeleteDialog = (page: CmsPage) => {
    setSelectedPage(page);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedPage(null);
  };

  const updateFormValue = <K extends keyof PageFormValues>(
    field: K,
    value: PageFormValues[K],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSaveForm = async () => {
    if (!isPageFormValid(formValues)) {
      setNotice({ severity: 'error', message: t('pages.pages.validationError') });
      return;
    }

    const payload = buildPagePayload(formValues);

    try {
      if (formMode === 'add') {
        await createPageMutation.mutateAsync(payload);
        setNotice({ severity: 'success', message: t('pages.pages.createSuccess') });
      } else if (selectedPage !== null) {
        await updatePageMutation.mutateAsync({
          pageId: selectedPage.id,
          payload,
        });
        setNotice({ severity: 'success', message: t('pages.pages.updateSuccess') });
      }

      closeFormDialog();
    } catch (error) {
      setNotice({
        severity: 'error',
        message: getApiErrorMessage(
          error,
          formMode === 'add' ? t('pages.pages.createError') : t('pages.pages.updateError'),
        ),
      });
    }
  };

  const handleDeletePage = async () => {
    if (selectedPage === null) {
      return;
    }

    try {
      await deletePageMutation.mutateAsync(selectedPage.id);
      closeDeleteDialog();
      setNotice({ severity: 'success', message: t('pages.pages.deleteSuccess') });
    } catch (error) {
      setNotice({
        severity: 'error',
        message: getApiErrorMessage(error, t('pages.pages.deleteError')),
      });
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.pages.title')}</Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {t('pages.pages.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('pages.pages.description')}
          </Typography>
        </Box>

        {canManagePages && (
          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={openAddDialog}
            disabled={isSaving}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0 }}
          >
            {t('pages.pages.addPage')}
          </Button>
        )}
      </Stack>

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
                <AdminTableHeadCell>{t('pages.pages.table.authors')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.status')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.publishedDate')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.modifiedDate')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.language')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.pages.table.records')}</AdminTableHeadCell>
                <AdminTableHeadCell align="center">
                  {t('pages.pages.table.actions')}
                </AdminTableHeadCell>
              </AdminTableHeadRow>
            </TableHead>
            <TableBody>
              {data.map((page) => {
                const isSelected = detailsPage?.id === page.id;
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
                    <TableCell sx={{ maxWidth: 320 }}>
                      {page.authors.length > 0 ? (
                        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                          {page.authors.map((author) => (
                            <Chip
                              key={author.id}
                              label={author.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {renderAuthorsSummary(page)}
                        </Typography>
                      )}
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
                    <TableCell align="center" onClick={(event) => event.stopPropagation()}>
                      <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                        {canManagePages && (
                          <>
                            <Tooltip title={t('pages.pages.editPage')}>
                              <IconButton
                                size="small"
                                color="primary"
                                aria-label={t('pages.pages.editPage')}
                                onClick={() => openEditDialog(page)}
                                disabled={isSaving}
                              >
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {canManageAuthors && (
                              <Tooltip title={t('pages.pages.table.manageAuthors')}>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  aria-label={t('pages.pages.table.manageAuthors')}
                                  onClick={() => setAuthorsPage(page)}
                                  disabled={isSaving}
                                >
                                  <GroupOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title={t('pages.pages.deletePage')}>
                              <IconButton
                                size="small"
                                color="error"
                                aria-label={t('pages.pages.deletePage')}
                                onClick={() => openDeleteDialog(page)}
                                disabled={isSaving}
                              >
                                <DeleteOutlineOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AdminTableContainer>
      )}

      <PageFormDialog
        open={isFormDialogOpen}
        mode={formMode}
        formValues={formValues}
        isSaving={
          formMode === 'add' ? createPageMutation.isPending : updatePageMutation.isPending
        }
        onClose={closeFormDialog}
        onSave={() => {
          void handleSaveForm();
        }}
        onChange={updateFormValue}
      />

      <AdminDialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <AdminDialogHeader
          title={t('pages.pages.deletePage')}
          subtitle={selectedPage?.title}
          icon={DeleteOutlineOutlinedIcon}
          tone="error"
          onClose={closeDeleteDialog}
          closeLabel={t('pages.pages.form.cancel')}
          closeDisabled={deletePageMutation.isPending}
        />
        <AdminDialogContent>
          <AdminDialogSection>
            <Typography variant="body1">
              {t('pages.pages.deleteConfirm', { name: selectedPage?.title ?? '' })}
            </Typography>
          </AdminDialogSection>
        </AdminDialogContent>
        <AdminDialogFooter>
          <AdminDialogCancelButton
            onClick={closeDeleteDialog}
            disabled={deletePageMutation.isPending}
          >
            {t('pages.pages.form.cancel')}
          </AdminDialogCancelButton>
          <AdminDialogDangerButton
            onClick={() => {
              void handleDeletePage();
            }}
            disabled={deletePageMutation.isPending}
          >
            {deletePageMutation.isPending
              ? t('pages.pages.form.deleting')
              : t('pages.pages.form.delete')}
          </AdminDialogDangerButton>
        </AdminDialogFooter>
      </AdminDialog>

      <PageDetailsDialog
        page={detailsPage !== null && pageHasDetails(detailsPage) ? detailsPage : null}
        onClose={closePageDetails}
      />

      <PageAuthorsDialog page={authorsPage} onClose={() => setAuthorsPage(null)} />

      <Snackbar
        open={notice !== null}
        autoHideDuration={4000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notice?.severity ?? 'success'}
          onClose={() => setNotice(null)}
          sx={{ width: '100%' }}
        >
          {notice?.message ?? ''}
        </Alert>
      </Snackbar>
    </Container>
  );
};
