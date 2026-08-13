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
import { useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
} from '../common/AdminTable';
import {
  formatPageDetailDateTime,
  getPagesTableLocale,
  usePageDetails,
} from '../../hooks/queries/usePages';
import { useLanguage } from '../../hooks/useLanguage';
import type { CmsPage } from '../../types/cmsPage';
import {
  createEmptyPageDetailFormValues,
  DEFAULT_PAGE_DETAILS_PAGE_SIZE,
  mapPageDetailToFormValues,
  type PageDetailFormValues,
  type PageDetailRecord,
} from '../../types/pageDetails';

type PageDetailDialogMode = 'add' | 'edit';

interface PageDetailsDialogProps {
  page: CmsPage | null;
  onClose: () => void;
}

export const PageDetailsDialog = ({ page, onClose }: PageDetailsDialogProps) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const tableLocale = getPagesTableLocale(language);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_DETAILS_PAGE_SIZE);
  const [dialogMode, setDialogMode] = useState<PageDetailDialogMode>('add');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PageDetailRecord | null>(null);
  const [formValues, setFormValues] = useState<PageDetailFormValues>(
    createEmptyPageDetailFormValues(),
  );
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const pageId = page?.id ?? null;
  const { data, isLoading, isError } = usePageDetails(pageId, pageNumber, pageSize);

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
    setFormValues(createEmptyPageDetailFormValues());
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (record: PageDetailRecord) => {
    setDialogMode('edit');
    setSelectedRecord(record);
    setFormValues(mapPageDetailToFormValues(record));
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (record: PageDetailRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedRecord(null);
    setFormValues(createEmptyPageDetailFormValues());
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

  const updateFormValue = <K extends keyof PageDetailFormValues>(
    field: K,
    value: PageDetailFormValues[K],
  ) => {
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
      <Dialog open={page !== null} onClose={onClose} fullWidth maxWidth="xl">
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
            <Button variant="contained" startIcon={<AddOutlinedIcon />} onClick={openAddDialog}>
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
              <Table size="small" aria-label={t('pages.pages.details.title')}>
                <TableHead>
                  <AdminTableHeadRow>
                    <AdminTableHeadCell>{t('pages.pages.details.table.id')}</AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.vesselName')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.imoNumber')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.departure')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.pilotOnboard')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.pilotCompleted')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.movementFrom')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell>
                      {t('pages.pages.details.table.updatedBy')}
                    </AdminTableHeadCell>
                    <AdminTableHeadCell align="center">
                      {t('pages.pages.details.table.actions')}
                    </AdminTableHeadCell>
                  </AdminTableHeadRow>
                </TableHead>
                <TableBody>
                  {data.items.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>{record.id}</TableCell>
                      <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {record.vesselName}
                      </TableCell>
                      <TableCell>{record.imoNumber}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatPageDetailDateTime(
                          record.departureDate,
                          record.departureTime,
                          tableLocale,
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatPageDetailDateTime(
                          record.datePilotOnboard,
                          record.timePilotOnboard,
                          tableLocale,
                        )}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {formatPageDetailDateTime(
                          record.datePilotCompleted,
                          record.timePilotCompleted,
                          tableLocale,
                        )}
                      </TableCell>
                      <TableCell>{record.movementFrom}</TableCell>
                      <TableCell>{record.updatedBy}</TableCell>
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('pages.pages.details.form.vesselName')}
                value={formValues.vesselName}
                onChange={(event) => updateFormValue('vesselName', event.target.value)}
                fullWidth
              />
              <TextField
                label={t('pages.pages.details.form.imoNumber')}
                value={formValues.imoNumber}
                onChange={(event) => updateFormValue('imoNumber', event.target.value)}
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('pages.pages.details.form.departureDate')}
                type="date"
                value={formValues.departureDate}
                onChange={(event) => updateFormValue('departureDate', event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t('pages.pages.details.form.departureTime')}
                type="time"
                value={formValues.departureTime}
                onChange={(event) => updateFormValue('departureTime', event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('pages.pages.details.form.datePilotOnboard')}
                type="date"
                value={formValues.datePilotOnboard}
                onChange={(event) => updateFormValue('datePilotOnboard', event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t('pages.pages.details.form.timePilotOnboard')}
                type="time"
                value={formValues.timePilotOnboard}
                onChange={(event) => updateFormValue('timePilotOnboard', event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('pages.pages.details.form.datePilotCompleted')}
                type="date"
                value={formValues.datePilotCompleted}
                onChange={(event) => updateFormValue('datePilotCompleted', event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label={t('pages.pages.details.form.timePilotCompleted')}
                type="time"
                value={formValues.timePilotCompleted}
                onChange={(event) => updateFormValue('timePilotCompleted', event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <TextField
              label={t('pages.pages.details.form.movementFrom')}
              value={formValues.movementFrom}
              onChange={(event) => updateFormValue('movementFrom', event.target.value)}
              fullWidth
            />
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
              name: selectedRecord?.vesselName ?? '',
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
