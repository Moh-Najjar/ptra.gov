import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
import { usePageDetails } from '../../hooks/queries/usePages';
import { useLanguage } from '../../hooks/useLanguage';
import type { CmsPage } from '../../types/cmsPage';
import {
  DEFAULT_PAGE_DETAILS_PAGE_SIZE,
  type PageDetailRecord,
} from '../../types/pageDetails';
import {
  createEmptyPageDetailFormValues,
  extractPageDetailColumnKeys,
  formatPageDetailCellValue,
  getEditablePageDetailFieldKeys,
  getPageDetailFieldLabel,
  getPageDetailInputType,
  getPageDetailRecordKey,
  getPageDetailRecordLabel,
  getPageDetailsTableLocale,
  mapPageDetailToFormValues,
} from '../../utils/pageDetails';

type PageDetailDialogMode = 'add' | 'edit';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PageDetailRecord | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const pageId = page?.id ?? null;
  const detailsEnabled = page !== null && page.isPageDetailsEnabled;
  const { data, isLoading, isError } = usePageDetails(
    pageId,
    pageNumber,
    pageSize,
    detailsEnabled,
  );

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
    setSelectedRecord(null);
    setFormValues(createEmptyPageDetailFormValues(editableFieldKeys));
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (record: PageDetailRecord) => {
    setDialogMode('edit');
    setSelectedRecord(record);
    setFormValues(mapPageDetailToFormValues(record, editableFieldKeys));
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (record: PageDetailRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedRecord(null);
    setFormValues({});
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  const showComingSoonNotice = () => {
    closeFormDialog();
    closeDeleteDialog();
    setIsComingSoonOpen(true);
  };

  const updateFormValue = (field: string, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
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
              disabled={editableFieldKeys.length === 0}
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
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('pages.pages.details.deleteRecord')}>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label={t('pages.pages.details.deleteRecord')}
                              onClick={() => openDeleteDialog(record)}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
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
                  label={getPageDetailFieldLabel(key, t)}
                  type={inputType}
                  value={value}
                  onChange={(event) => updateFormValue(key, event.target.value)}
                  fullWidth
                  slotProps={
                    inputType === 'date' || inputType === 'time'
                      ? { inputLabel: { shrink: true } }
                      : undefined
                  }
                />
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeFormDialog}>{t('pages.pages.details.form.cancel')}</Button>
          <Button variant="contained" onClick={showComingSoonNotice}>
            {t('pages.pages.details.form.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>{t('pages.pages.details.deleteRecord')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ pt: 0.5 }}>
            {t('pages.pages.details.deleteConfirm', {
              name: selectedRecord ? getPageDetailRecordLabel(selectedRecord) : '',
            })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog}>{t('pages.pages.details.form.cancel')}</Button>
          <Button variant="contained" color="error" onClick={showComingSoonNotice}>
            {t('pages.pages.details.form.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isComingSoonOpen}
        autoHideDuration={4000}
        onClose={() => setIsComingSoonOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setIsComingSoonOpen(false)} sx={{ width: '100%' }}>
          {t('pages.pages.details.comingSoon')}
        </Alert>
      </Snackbar>
    </>
  );
};
