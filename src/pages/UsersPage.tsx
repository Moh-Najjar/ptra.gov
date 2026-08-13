import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  AdminTableContainer,
  AdminTableHeadCell,
  AdminTableHeadRow,
} from '../components/common/AdminTable';
import { useUsers } from '../hooks/queries/useUsers';
import {
  createEmptyUserFormValues,
  mapAdminUserToFormValues,
  type AdminUser,
  type UserFormValues,
} from '../types/user';
import { USER_ROLES } from '../types/roles';

type UserDialogMode = 'add' | 'edit';

const ROLE_OPTIONS = Object.values(USER_ROLES);

const getRoleLabel = (role: string, t: (key: string) => string): string => {
  const translationKey = `pages.users.roles.${role}`;
  const translated = t(translationKey);
  return translated === translationKey ? role : translated;
};

export const UsersPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useUsers();

  const [dialogMode, setDialogMode] = useState<UserDialogMode>('add');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formValues, setFormValues] = useState<UserFormValues>(createEmptyUserFormValues());
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const sortedUsers = useMemo(
    () => [...(data ?? [])].sort((first, second) => first.fullName.localeCompare(second.fullName)),
    [data],
  );

  const dialogTitle =
    dialogMode === 'add' ? t('pages.users.addUser') : t('pages.users.editUser');

  const openAddDialog = () => {
    setDialogMode('add');
    setSelectedUser(null);
    setFormValues(createEmptyUserFormValues());
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (user: AdminUser) => {
    setDialogMode('edit');
    setSelectedUser(user);
    setFormValues(mapAdminUserToFormValues(user));
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const closeFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedUser(null);
    setFormValues(createEmptyUserFormValues());
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const showComingSoonNotice = () => {
    closeFormDialog();
    closeDeleteDialog();
    setIsComingSoonOpen(true);
  };

  const updateFormValue = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.users.title')}</Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: { sm: 'center' } }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {t('pages.users.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t('pages.users.description')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={openAddDialog}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0 }}
        >
          {t('pages.users.addUser')}
        </Button>
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress aria-label={t('pages.users.loading')} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('pages.users.loadError')}
        </Alert>
      )}

      {!isLoading && !isError && sortedUsers.length === 0 && (
        <Alert severity="info">{t('pages.users.noData')}</Alert>
      )}

      {!isLoading && !isError && sortedUsers.length > 0 && (
        <AdminTableContainer>
          <Table aria-label={t('pages.users.title')}>
            <TableHead>
              <AdminTableHeadRow>
                <AdminTableHeadCell>{t('pages.users.table.id')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.users.table.fullName')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.users.table.email')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.users.table.role')}</AdminTableHeadCell>
                <AdminTableHeadCell>{t('pages.users.table.status')}</AdminTableHeadCell>
                <AdminTableHeadCell align="center">
                  {t('pages.users.table.actions')}
                </AdminTableHeadCell>
              </AdminTableHeadRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.role, t)}
                      size="small"
                      variant="outlined"
                      color={user.role === USER_ROLES.ADMINISTRATOR ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        user.isActive
                          ? t('pages.users.status.active')
                          : t('pages.users.status.inactive')
                      }
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                      <Tooltip title={t('pages.users.editUser')}>
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label={t('pages.users.editUser')}
                          onClick={() => openEditDialog(user)}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('pages.users.deleteUser')}>
                        <IconButton
                          size="small"
                          color="error"
                          aria-label={t('pages.users.deleteUser')}
                          onClick={() => openDeleteDialog(user)}
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
        </AdminTableContainer>
      )}

      <Dialog open={isFormDialogOpen} onClose={closeFormDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label={t('pages.users.form.fullName')}
              value={formValues.fullName}
              onChange={(event) => updateFormValue('fullName', event.target.value)}
              fullWidth
            />
            <TextField
              label={t('pages.users.form.email')}
              type="email"
              value={formValues.email}
              onChange={(event) => updateFormValue('email', event.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="user-role-label">{t('pages.users.form.role')}</InputLabel>
              <Select
                labelId="user-role-label"
                label={t('pages.users.form.role')}
                value={formValues.role}
                onChange={(event) => updateFormValue('role', event.target.value)}
              >
                {ROLE_OPTIONS.map((role) => (
                  <MenuItem key={role} value={role}>
                    {getRoleLabel(role, t)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formValues.isActive}
                  onChange={(event) => updateFormValue('isActive', event.target.checked)}
                />
              }
              label={t('pages.users.form.isActive')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeFormDialog}>{t('pages.users.form.cancel')}</Button>
          <Button variant="contained" onClick={showComingSoonNotice}>
            {t('pages.users.form.save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>{t('pages.users.deleteUser')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ pt: 0.5 }}>
            {t('pages.users.deleteConfirm', { name: selectedUser?.fullName ?? '' })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteDialog}>{t('pages.users.form.cancel')}</Button>
          <Button variant="contained" color="error" onClick={showComingSoonNotice}>
            {t('pages.users.form.delete')}
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
          {t('pages.users.comingSoon')}
        </Alert>
      </Snackbar>
    </Container>
  );
};
