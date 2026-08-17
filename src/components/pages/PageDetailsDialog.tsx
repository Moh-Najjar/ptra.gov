import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
} from '../common/AdminTable';
import { useCreatePageDetail, usePageDetails, useUpdatePageDetail } from '../../hooks/usePages';
import { useLanguage } from '../../hooks/useLanguage';
import type { CmsPage } from '../../types/cmsPage';
import {
  DEFAULT_PAGE_DETAILS_PAGE_SIZE,
  type PageDetailRecord,
} from '../../types/pageDetails';
import { getApiErrorMessage } from '../../utils/apiErrors';
import {
  buildPageDetailPayload,
  createEmptyPageDetailFormValues,
  extractPageDetailColumnKeys,
  formatPageDetailCellValue,
  getEditablePageDetailFieldKeys,
  getPageDetailInputType,
  getPageDetailRecordId,
  getPageDetailRecordKey,
  getPageDetailsTableLocale,
  humanizePageDetailFieldKey,
  mapPageDetailToFormValues,
} from '../../utils/pageDetails';

type PageDetailDialogMode = 'add' | 'edit';

interface PageDetailNotice {
  severity: 'success' | 'error';
  message: string;
}

interface PageDetailsDialogProps {
  page: CmsPage | null;
  onClose: () => void;
}

export const PageDetailsDialog = ({ page, onClose }: PageDetailsDialogProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const tableLocale = getPageDetailsTableLocale(language);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_DETAILS_PAGE_SIZE);
  const [dialogMode, setDialogMode] = useState<PageDetailDialogMode>('add');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<PageDetailNotice | null>(null);

  const pageId = page?.id ?? null;
  const detailsEnabled = page !== null && page.isPageDetailsEnabled;
  const { data, isLoading, isError } = usePageDetails(
    pageId,
    pageNumber,
    pageSize,
    detailsEnabled,
  );

  const createPageDetailMutation = useCreatePageDetail();
  const updatePageDetailMutation = useUpdatePageDetail();

  const isSaving = createPageDetailMutation.isPending || updatePageDetailMutation.isPending;

  const columnKeys = useMemo(
    () => (data ? extractPageDetailColumnKeys(data.items) : []),
    [data],
  );

  const editableFieldKeys = useMemo(
    () => getEditablePageDetailFieldKeys(columnKeys),
    [columnKeys],
  );

  useEffect(() => {
    if (pageId !== null) {
      setPageNumber(1);
      setPageSize(DEFAULT_PAGE_DETAILS_PAGE_SIZE);
    }
  }, [pageId]);

  const dialogTitle =
    dialogMode === 'add'
      ? t('pages.pages.details.addRecord')
      : t('pages.pages.details.editRecord');

  const openAddDialog = () => {
    setDialogMode('add');
    setEditingRecordId(null);
    setFormError(null);
    setFormValues(createEmptyPageDetailFormValues(editableFieldKeys));
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (record: PageDetailRecord) => {
    const recordId = getPageDetailRecordId(record);
    if (recordId === null) {
      setNotice({
        severity: 'error',
        message: t('pages.pages.details.saveError'),
      });
      return;
    }

    setDialogMode('edit');
    setEditingRecordId(recordId);
    setFormError(null);
    setFormValues(mapPageDetailToFormValues(record, editableFieldKeys));
    setIsFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setEditingRecordId(null);
    setFormValues({});
    setFormError(null);
  };

  const handleSave = async () => {
    if (pageId === null) {
      return;
    }

    setFormError(null);

    const payload = buildPageDetailPayload(formValues, editableFieldKeys);

    try {
      if (dialogMode === 'add') {
        await createPageDetailMutation.mutateAsync({
          pageId,
          pageNumber,
          pageSize,
          payload,
        });
        setNotice({
          severity: 'success',
          message: t('pages.pages.details.createSuccess'),
        });
      } else if (editingRecordId !== null) {
        await updatePageDetailMutation.mutateAsync({
          pageId,
          recordId: editingRecordId,
          pageNumber,
          pageSize,
          payload,
        });
        setNotice({
          severity: 'success',
          message: t('pages.pages.details.updateSuccess'),
        });
      } else {
        setFormError(t('pages.pages.details.saveError'));
        return;
      }

      closeFormDialog();
    } catch (error) {
      setFormError(getApiErrorMessage(error, t('pages.pages.details.saveError')));
    }
  };

  const updateFormValue = (field: string, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setFormError(null);
  };

  const handlePageChange = (_event: unknown, nextPage: number) => {
    setPageNumber(nextPage + 1);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPageSize(Number(event.target.value));
    setPageNumber(1);
  };

  return (
    <>
      <Dialog open={page !== null && page.isPageDetailsEnabled} onClose={onClose} fullWidth maxWidth="xl">
        <DialogTitle sx={{ pr: 6 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                {page?.title}
              </Typography>
              {page && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {`${t('pages.pages.details.pageId')}: ${page.id}`}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={openAddDialog}
              disabled={editableFieldKeys.length === 0 || isSaving}
            >
              {t('pages.pages.details.addRecord')}
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress aria-label={t('pages.pages.details.loading')} />
            </Box>
          )}

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('pages.pages.details.loadError')}
            </Alert>
          )}

          {!isLoading && !isError && data && data.items.length === 0 && (
            <Alert severity="info">{t('pages.pages.details.noData')}</Alert>
          )}

          {!isLoading && !isError && data && data.items.length > 0 && (
            <AdminTableContainer>
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" aria-label={t('pages.pages.details.title')}>
                <TableHead>
                  <AdminTableHeadRow>
                    {columnKeys.map((key) => (
                      <AdminTableHeadCell key={key}>{key}</AdminTableHeadCell>
                    ))}
                    <AdminTableHeadCell align="center">
                      {t('pages.pages.details.table.actions')}
                    </AdminTableHeadCell>
                  </AdminTableHeadRow>
                </TableHead>
                <TableBody>
                  {data.items.map((record, index) => (
                    <TableRow key={getPageDetailRecordKey(record, index)} hover>
                      {columnKeys.map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            whiteSpace: 'nowrap',
                            fontWeight: key === 'id' ? 600 : undefined,
                          }}
                        >
                          {formatPageDetailCellValue(record[key], tableLocale)}
                        </TableCell>
                      ))}
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                          <Tooltip title={t('pages.pages.details.editRecord')}>
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label={t('pages.pages.details.editRecord')}
                              onClick={() => openEditDialog(record)}
                              disabled={isSaving || getPageDetailRecordId(record) === null}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </Box>
              <TablePagination
                component="div"
                count={data.totalCount}
                page={Math.max(data.pageNumber - 1, 0)}
                rowsPerPage={data.pageSize}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage={t('pages.pages.details.pagination.rowsPerPage')}
                labelDisplayedRows={({ from, to, count }) =>
                  t('pages.pages.details.pagination.displayedRows', { from, to, count })
                }
              />
            </AdminTableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>{t('pages.pages.details.close')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isFormDialogOpen} onClose={closeFormDialog} fullWidth maxWidth="md">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {editableFieldKeys.map((key) => {
              const value = formValues[key] ?? '';
              const inputType = getPageDetailInputType(key, value);

              return (
                <TextField
                  key={key}
                  label={humanizePageDetailFieldKey(key)}
                  type={inputType}
                  value={value}
                  onChange={(event) => updateFormValue(key, event.target.value)}
                  fullWidth
                  disabled={isSaving}
                  slotProps={
                    inputType === 'date' || inputType === 'time'
                      ? { inputLabel: { shrink: true } }
                      : undefined
                  }
                />
              );
            })}

            {formError && <Alert severity="error">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeFormDialog} disabled={isSaving}>
            {t('pages.pages.details.form.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleSave();
            }}
            disabled={isSaving}
          >
            {isSaving ? t('pages.pages.details.form.saving') : t('pages.pages.details.form.save')}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};
