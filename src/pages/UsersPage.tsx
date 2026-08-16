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
import { AddUserDialog } from '../components/users/AddUserDialog';
import { useUsers, useUpdateUser, useDeleteUser } from '../hooks/useUsers';
import { useRoles } from '../hooks/useRoles';
import {
  buildUpdateUserPayload,
  createEmptyAddUserFormValues,
  createEmptyUserFormValues,
  isUserFormValid,
  mapAdminUserToFormValues,
  type AddUserFormValues,
  type AdminUser,
  type UserFormValues,
} from '../types/user';
import { getApiErrorMessage } from '../utils/apiErrors';
import {
  getDefaultAddUserRoleKey,
  getDefaultRoleKey,
  getRoleDisplayName,
  isAdministratorRole,
} from '../utils/roleLabels';
import { generateSecurePassword } from '../utils/password';

type UserNoticeSeverity = 'success' | 'error' | 'info';

interface UserNotice {
  severity: UserNoticeSeverity;
  message: string;
}

export const UsersPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useUsers();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const {
    data: roles = [],
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useRoles();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [addFormValues, setAddFormValues] = useState<AddUserFormValues>(
    createEmptyAddUserFormValues(),
  );
  const [editFormValues, setEditFormValues] = useState<UserFormValues>(createEmptyUserFormValues());
  const [notice, setNotice] = useState<UserNotice | null>(null);

  const sortedUsers = useMemo(
    () => [...(data ?? [])].sort((first, second) => first.fullName.localeCompare(second.fullName)),
    [data],
  );

  const getRoleLabel = (roleKey: string): string => getRoleDisplayName(roleKey, roles, t);

  const createInitialAddFormValues = (): AddUserFormValues =>
    createEmptyAddUserFormValues(
      getDefaultAddUserRoleKey(roles),
      generateSecurePassword(),
    );

  const openAddDialog = () => {
    setSelectedUser(null);
    setAddFormValues(createInitialAddFormValues());
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setEditFormValues(mapAdminUserToFormValues(user));
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setAddFormValues(createEmptyAddUserFormValues());
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setEditFormValues(createEmptyUserFormValues(getDefaultRoleKey(roles)));
  };

  const openDeleteDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const showComingSoonNotice = () => {
    closeAddDialog();
    setNotice({ severity: 'info', message: t('pages.users.comingSoon') });
  };

  const handleSaveEdit = async () => {
    if (!selectedUser || !isUserFormValid(editFormValues)) {
      setNotice({ severity: 'error', message: t('pages.users.validationError') });
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser.id,
        payload: buildUpdateUserPayload(editFormValues),
      });
      closeEditDialog();
      setNotice({ severity: 'success', message: t('pages.users.saveSuccess') });
    } catch (error) {
      setNotice({
        severity: 'error',
        message: getApiErrorMessage(error, t('pages.users.saveError')),
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      closeDeleteDialog();
      setNotice({ severity: 'success', message: t('pages.users.deleteSuccess') });
    } catch (error) {
      setNotice({
        severity: 'error',
        message: getApiErrorMessage(error, t('pages.users.deleteError')),
      });
    }
  };

  const updateAddFormValue = <K extends keyof AddUserFormValues>(
    field: K,
    value: AddUserFormValues[K],
  ) => {
    setAddFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const updateEditFormValue = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => {
    setEditFormValues((currentValues) => ({
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
                      label={getRoleLabel(user.role)}
                      size="small"
                      variant="outlined"
                      color={isAdministratorRole(user.role) ? 'primary' : 'default'}
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

      <AddUserDialog
        open={isAddDialogOpen}
        formValues={addFormValues}
        roles={roles}
        isRolesLoading={isRolesLoading}
        isRolesError={isRolesError}
        onClose={closeAddDialog}
        onSave={showComingSoonNotice}
        onChange={updateAddFormValue}
      />

      <Dialog open={isEditDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('pages.users.editUser')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label={t('pages.users.form.fullName')}
              value={editFormValues.fullName}
              onChange={(event) => updateEditFormValue('fullName', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('pages.users.form.email')}
              type="email"
              value={editFormValues.email}
              onChange={(event) => updateEditFormValue('email', event.target.value)}
              fullWidth
              required
            />
            <TextField
              label={t('pages.users.form.newPassword')}
              type="password"
              value={editFormValues.password}
              onChange={(event) => updateEditFormValue('password', event.target.value)}
              fullWidth
              autoComplete="new-password"
              helperText={t('pages.users.form.newPasswordHint')}
            />
            <FormControl fullWidth error={isRolesError}>
              <InputLabel id="user-role-label">{t('pages.users.form.role')}</InputLabel>
              <Select
                labelId="user-role-label"
                label={t('pages.users.form.role')}
                value={editFormValues.role}
                onChange={(event) => updateEditFormValue('role', event.target.value)}
                disabled={isRolesLoading || roles.length === 0}
              >
                {roles.map((role) => (
                  <MenuItem key={role.key} value={role.key}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isRolesLoading && (
              <Typography variant="body2" color="text.secondary">
                {t('pages.users.rolesLoading')}
              </Typography>
            )}
            {isRolesError && (
              <Alert severity="error">{t('pages.users.rolesLoadError')}</Alert>
            )}
            <FormControlLabel
              control={
                <Switch
                  checked={editFormValues.isActive}
                  onChange={(event) => updateEditFormValue('isActive', event.target.checked)}
                />
              }
              label={t('pages.users.form.isActive')}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeEditDialog} disabled={updateUserMutation.isPending}>
            {t('pages.users.form.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void handleSaveEdit();
            }}
            disabled={
              isRolesLoading || roles.length === 0 || updateUserMutation.isPending
            }
          >
            {updateUserMutation.isPending
              ? t('pages.users.form.saving')
              : t('pages.users.form.save')}
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
          <Button onClick={closeDeleteDialog} disabled={deleteUserMutation.isPending}>
            {t('pages.users.form.cancel')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              void handleDeleteUser();
            }}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending
              ? t('pages.users.form.deleting')
              : t('pages.users.form.delete')}
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
          severity={notice?.severity ?? 'info'}
          onClose={() => setNotice(null)}
          sx={{ width: '100%' }}
        >
          {notice?.message ?? ''}
        </Alert>
      </Snackbar>
    </Container>
  );
};
