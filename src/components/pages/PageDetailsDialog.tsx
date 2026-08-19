import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
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
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogPrimaryButton,
  AdminDialogSection,
} from '../common/AdminDialog';
import { useCreatePageDetail, useApmscoMovements, usePageDetails, useUpdatePageDetail } from '../../hooks/usePages';
import { useLanguage } from '../../hooks/useLanguage';
import { buildApmscoMovementValueMap, getApmscoMovementLabel } from '../../types/apmscoBerthing';
import type { CmsPage } from '../../types/cmsPage';
import {
  DEFAULT_PAGE_DETAILS_PAGE_SIZE,
  isPageDetailMovementField,
  type PageDetailRecord,
  type PageDetailValue,
} from '../../types/pageDetails';
import { getApiErrorMessage } from '../../utils/apiErrors';
import {
  buildPageDetailPayload,
  createEmptyPageDetailFormValues,
  extractPageDetailColumnKeys,
  formatPageDetailCellValue,
  getEditablePageDetailFieldKeys,
  getPageDetailFieldLabel,
  getPageDetailInputType,
  getPageDetailRecordId,
  getPageDetailRecordKey,
  getPageDetailsTableLocale,
  isOptionalPageDetailField,
  isPageDetailFormValid,
  isPageDetailImoField,
  mapPageDetailToFormValues,
  sanitizePageDetailImoValue,
  validatePageDetailFormValues,
  type PageDetailFieldErrors,
} from '../../utils/pageDetails';
import { getValidationMessages } from '../../utils/validationMessages';

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
  const [fieldErrors, setFieldErrors] = useState<PageDetailFieldErrors>({});
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

  const needsMovementOptions = useMemo(
    () => columnKeys.some(isPageDetailMovementField),
    [columnKeys],
  );

  const {
    data: movements = [],
    isLoading: isMovementsLoading,
    isError: isMovementsError,
  } = useApmscoMovements(detailsEnabled && needsMovementOptions);

  const movementByValue = useMemo(() => buildApmscoMovementValueMap(movements), [movements]);

  const renderRecordCellValue = (key: string, value: PageDetailValue | undefined): string => {
    if (isPageDetailMovementField(key) && typeof value === 'string') {
      const movement = movementByValue.get(value);
      if (movement) {
        return getApmscoMovementLabel(movement, language);
      }
    }

    return formatPageDetailCellValue(value, tableLocale);
  };

  const renderFormField = (key: string) => {
    const value = formValues[key] ?? '';
    const fieldLabel = getPageDetailFieldLabel(key, t);
    const fieldError = fieldErrors[key];
    const hasError = typeof fieldError === 'string' && fieldError.length > 0;
    const isRequired = !isOptionalPageDetailField(key, pageId);

    if (isPageDetailMovementField(key)) {
      const hasUnknownValue =
        value.length > 0 && movementByValue.get(value) === undefined;

      return (
        <TextField
          key={key}
          select
          label={fieldLabel}
          value={value}
          onChange={(event) => updateFormValue(key, event.target.value)}
          fullWidth
          required={isRequired}
          error={hasError}
          helperText={fieldError}
          disabled={isSaving || isMovementsLoading}
          slotProps={{
            inputLabel: { shrink: true },
            select: {
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                const selectedValue = typeof selected === 'string' ? selected : '';

                if (selectedValue.length === 0) {
                  return (
                    <Typography component="span" color="text.secondary">
                      {t('pages.pages.details.selectMovement')}
                    </Typography>
                  );
                }

                const movement = movementByValue.get(selectedValue);
                return movement ? getApmscoMovementLabel(movement, language) : selectedValue;
              },
            },
          }}
        >
          <MenuItem value="">
            <em>{t('pages.pages.details.selectMovement')}</em>
          </MenuItem>
          {hasUnknownValue && <MenuItem value={value}>{value}</MenuItem>}
          {movements.map((movement) => (
            <MenuItem key={movement.value} value={movement.value}>
              {getApmscoMovementLabel(movement, language)}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    const inputType = getPageDetailInputType(key, value);
    const isImoField = isPageDetailImoField(key);

    return (
      <TextField
        key={key}
        label={fieldLabel}
        type={isImoField ? 'text' : inputType}
        value={value}
        onChange={(event) => {
          const nextValue = isImoField
            ? sanitizePageDetailImoValue(event.target.value)
            : event.target.value;
          updateFormValue(key, nextValue);
        }}
        fullWidth
        required={isRequired}
        error={hasError}
        helperText={fieldError ?? (isImoField ? t('pages.pages.details.imoHint') : undefined)}
        disabled={isSaving}
        slotProps={{
          ...(inputType === 'date' || inputType === 'time'
            ? { inputLabel: { shrink: true } }
            : {}),
          ...(isImoField
            ? {
                htmlInput: {
                  inputMode: 'numeric',
                  maxLength: 7,
                  pattern: '\\d{7}',
                },
              }
            : {}),
        }}
      />
    );
  };

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
    setFieldErrors({});
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
    setFieldErrors({});
    setFormValues(mapPageDetailToFormValues(record, editableFieldKeys));
    setIsFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setEditingRecordId(null);
    setFormValues({});
    setFieldErrors({});
    setFormError(null);
  };

  const handleSave = async () => {
    if (pageId === null) {
      return;
    }

    setFormError(null);

    const validationMessages = getValidationMessages(t);
    const nextFieldErrors = validatePageDetailFormValues(
      formValues,
      editableFieldKeys,
      validationMessages,
      pageId,
    );

    if (!isPageDetailFormValid(nextFieldErrors)) {
      setFieldErrors(nextFieldErrors);
      setFormError(t('pages.users.validationError'));
      return;
    }

    setFieldErrors({});
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
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
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
      <AdminDialog
        open={page !== null && page.isPageDetailsEnabled}
        onClose={onClose}
        fullWidth
        maxWidth="xl"
      >
        <AdminDialogHeader
          title={page?.title ?? t('pages.pages.details.title')}
          subtitle={
            page ? `${t('pages.pages.details.pageId')}: ${page.id}` : undefined
          }
          icon={DescriptionOutlinedIcon}
          onClose={onClose}
          closeLabel={t('pages.pages.details.close')}
          action={
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={openAddDialog}
              disabled={editableFieldKeys.length === 0 || isSaving}
              sx={{
                bgcolor: 'background.paper',
                color: 'primary.main',
                fontWeight: 700,
                px: 1.5,
                fontSize: '0.8125rem',
                '&:hover': {
                  bgcolor: 'background.paper',
                  opacity: 0.92,
                },
              }}
            >
              {t('pages.pages.details.addRecord')}
            </Button>
          }
        />

        <AdminDialogContent disablePadding>
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
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
                      <AdminTableHeadCell key={key}>
                        {getPageDetailFieldLabel(key, t)}
                      </AdminTableHeadCell>
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
                          {renderRecordCellValue(key, record[key])}
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
          </Box>
        </AdminDialogContent>

        <AdminDialogFooter>
          <AdminDialogCancelButton onClick={onClose}>
            {t('pages.pages.details.close')}
          </AdminDialogCancelButton>
        </AdminDialogFooter>
      </AdminDialog>

      <AdminDialog open={isFormDialogOpen} onClose={closeFormDialog} fullWidth maxWidth="md">
        <AdminDialogHeader
          title={dialogTitle}
          icon={dialogMode === 'add' ? AddOutlinedIcon : EditOutlinedIcon}
          onClose={closeFormDialog}
          closeLabel={t('pages.pages.details.form.cancel')}
          closeDisabled={isSaving}
        />
        <AdminDialogContent>
          <AdminDialogSection>
            <Stack spacing={2.5}>
              {editableFieldKeys.map((key) => renderFormField(key))}

              {isMovementsLoading && needsMovementOptions && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <CircularProgress size={24} aria-label={t('pages.pages.details.loading')} />
                </Box>
              )}

              {isMovementsError && needsMovementOptions && (
                <Alert severity="error">{t('pages.pages.details.movementsLoadError')}</Alert>
              )}

              {formError && <Alert severity="error">{formError}</Alert>}
            </Stack>
          </AdminDialogSection>
        </AdminDialogContent>
        <AdminDialogFooter>
          <AdminDialogCancelButton onClick={closeFormDialog} disabled={isSaving}>
            {t('pages.pages.details.form.cancel')}
          </AdminDialogCancelButton>
          <AdminDialogPrimaryButton
            onClick={() => {
              void handleSave();
            }}
            disabled={isSaving || (needsMovementOptions && isMovementsLoading)}
          >
            {isSaving ? t('pages.pages.details.form.saving') : t('pages.pages.details.form.save')}
          </AdminDialogPrimaryButton>
        </AdminDialogFooter>
      </AdminDialog>

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
