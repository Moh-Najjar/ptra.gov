import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppRole } from '../../types/role';
import type { AddUserFormValues } from '../../types/user';
import {
  generateSecurePassword,
  getPasswordStrength,
  getPasswordStrengthColor,
  type PasswordStrengthLevel,
} from '../../utils/password';

interface AddUserDialogProps {
  open: boolean;
  formValues: AddUserFormValues;
  roles: readonly AppRole[];
  isRolesLoading: boolean;
  isRolesError: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: <K extends keyof AddUserFormValues>(field: K, value: AddUserFormValues[K]) => void;
}

const LANGUAGE_OPTIONS = ['', 'ar', 'en'] as const;

export const AddUserDialog = ({
  open,
  formValues,
  roles,
  isRolesLoading,
  isRolesError,
  onClose,
  onSave,
  onChange,
}: AddUserDialogProps) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formValues.password),
    [formValues.password],
  );

  const strengthLabelKey = useMemo((): `pages.users.form.passwordStrength.${PasswordStrengthLevel}` => {
    return `pages.users.form.passwordStrength.${passwordStrength.level}`;
  }, [passwordStrength.level]);

  const handleGeneratePassword = () => {
    onChange('password', generateSecurePassword());
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((currentValue) => !currentValue);
  };

  const getLanguageLabel = (languageCode: (typeof LANGUAGE_OPTIONS)[number]): string => {
    if (languageCode === '') {
      return t('pages.users.form.defaultLanguage');
    }

    return t(`pages.users.form.languages.${languageCode}`);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('pages.users.addNewUser')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label={t('pages.users.form.usernameRequired')}
            value={formValues.username}
            onChange={(event) => onChange('username', event.target.value)}
            fullWidth
            required
            autoComplete="username"
          />
          <TextField
            label={t('pages.users.form.emailRequired')}
            type="email"
            value={formValues.email}
            onChange={(event) => onChange('email', event.target.value)}
            fullWidth
            required
            autoComplete="email"
          />
          <TextField
            label={t('pages.users.form.firstName')}
            value={formValues.firstName}
            onChange={(event) => onChange('firstName', event.target.value)}
            fullWidth
            autoComplete="given-name"
          />
          <TextField
            label={t('pages.users.form.lastName')}
            value={formValues.lastName}
            onChange={(event) => onChange('lastName', event.target.value)}
            fullWidth
            autoComplete="family-name"
          />
          <TextField
            label={t('pages.users.form.website')}
            type="url"
            value={formValues.website}
            onChange={(event) => onChange('website', event.target.value)}
            fullWidth
            autoComplete="url"
          />
          <FormControl fullWidth>
            <InputLabel id="add-user-language-label">{t('pages.users.form.language')}</InputLabel>
            <Select
              labelId="add-user-language-label"
              label={t('pages.users.form.language')}
              value={formValues.language}
              onChange={(event) => onChange('language', event.target.value)}
            >
              {LANGUAGE_OPTIONS.map((languageCode) => (
                <MenuItem key={languageCode || 'default'} value={languageCode}>
                  {getLanguageLabel(languageCode)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 1, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('pages.users.form.password')}
              </Typography>
              <Button size="small" variant="outlined" onClick={handleGeneratePassword}>
                {t('pages.users.form.generatePassword')}
              </Button>
            </Stack>
            <TextField
              value={formValues.password}
              onChange={(event) => onChange('password', event.target.value)}
              type={isPasswordVisible ? 'text' : 'password'}
              fullWidth
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        color="inherit"
                        onClick={handleTogglePasswordVisibility}
                        startIcon={
                          isPasswordVisible ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )
                        }
                        sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                      >
                        {isPasswordVisible
                          ? t('pages.users.form.hidePassword')
                          : t('pages.users.form.showPassword')}
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {passwordStrength.level !== 'empty' && (
              <Box sx={{ mt: 1.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.progress}
                  color={getPasswordStrengthColor(passwordStrength.level)}
                  sx={{ height: 6, borderRadius: 999 }}
                />
                <Typography
                  variant="caption"
                  color={`${getPasswordStrengthColor(passwordStrength.level)}.main`}
                  sx={{ mt: 0.75, display: 'block', fontWeight: 600 }}
                >
                  {t(strengthLabelKey)}
                </Typography>
              </Box>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={formValues.sendNotification}
                onChange={(event) => onChange('sendNotification', event.target.checked)}
              />
            }
            label={t('pages.users.form.sendNotification')}
          />

          <FormControl fullWidth error={isRolesError}>
            <InputLabel id="add-user-role-label">{t('pages.users.form.role')}</InputLabel>
            <Select
              labelId="add-user-role-label"
              label={t('pages.users.form.role')}
              value={formValues.role}
              onChange={(event) => onChange('role', event.target.value)}
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
          {isRolesError && <Alert severity="error">{t('pages.users.rolesLoadError')}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>{t('pages.users.form.cancel')}</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isRolesLoading || roles.length === 0}
        >
          {t('pages.users.form.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
