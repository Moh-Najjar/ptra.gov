import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AdminDialog,
  AdminDialogCancelButton,
  AdminDialogContent,
  AdminDialogFooter,
  AdminDialogHeader,
  AdminDialogPrimaryButton,
  AdminDialogSection,
} from '../common/AdminDialog';
import {
  PAGE_FORM_STATUSES,
  type PageFormStatus,
  type PageFormValues,
} from '../../types/cmsPage';
import { getRequiredFieldError } from '../../utils/formValidation';
import { getValidationMessages } from '../../utils/validationMessages';

type PageFormMode = 'add' | 'edit';
type PageFieldErrors = Partial<Record<keyof PageFormValues, string>>;

interface PageFormDialogProps {
  open: boolean;
  mode: PageFormMode;
  formValues: PageFormValues;
  isSaving?: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: <K extends keyof PageFormValues>(field: K, value: PageFormValues[K]) => void;
}

export const PageFormDialog = ({
  open,
  mode,
  formValues,
  isSaving = false,
  onClose,
  onSave,
  onChange,
}: PageFormDialogProps) => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<PageFieldErrors>({});

  const handleFieldChange = <K extends keyof PageFormValues>(
    field: K,
    value: PageFormValues[K],
  ) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    onChange(field, value);
  };

  const handleSaveClick = () => {
    const messages = getValidationMessages(t);
    const nextErrors: PageFieldErrors = {
      title: getRequiredFieldError(formValues.title, messages),
      content: getRequiredFieldError(formValues.content, messages),
      status: getRequiredFieldError(formValues.status, messages),
    };

    const hasErrors = Object.values(nextErrors).some(
      (error) => typeof error === 'string' && error.length > 0,
    );

    if (hasErrors) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    onSave();
  };

  const handleClose = () => {
    setFieldErrors({});
    onClose();
  };

  return (
    <AdminDialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <AdminDialogHeader
        title={mode === 'add' ? t('pages.pages.addPage') : t('pages.pages.editPage')}
        icon={mode === 'add' ? DescriptionOutlinedIcon : EditOutlinedIcon}
        onClose={handleClose}
        closeLabel={t('pages.pages.form.cancel')}
        closeDisabled={isSaving}
      />

      <AdminDialogContent>
        <AdminDialogSection>
          <Stack spacing={2.5}>
            <TextField
              label={t('pages.pages.form.title')}
              value={formValues.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              fullWidth
              required
              error={Boolean(fieldErrors.title)}
              helperText={fieldErrors.title}
              disabled={isSaving}
            />

            <TextField
              label={t('pages.pages.form.content')}
              value={formValues.content}
              onChange={(event) => handleFieldChange('content', event.target.value)}
              fullWidth
              required
              multiline
              minRows={6}
              error={Boolean(fieldErrors.content)}
              helperText={fieldErrors.content ?? t('pages.pages.form.contentHint')}
              disabled={isSaving}
            />

            <FormControl fullWidth required error={Boolean(fieldErrors.status)} disabled={isSaving}>
              <InputLabel id="page-status-label">{t('pages.pages.form.status')}</InputLabel>
              <Select
                labelId="page-status-label"
                label={t('pages.pages.form.status')}
                value={formValues.status}
                onChange={(event) =>
                  handleFieldChange('status', event.target.value as PageFormStatus)
                }
              >
                {PAGE_FORM_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`pages.pages.status.${status}`)}
                  </MenuItem>
                ))}
              </Select>
              {fieldErrors.status && <FormHelperText>{fieldErrors.status}</FormHelperText>}
            </FormControl>
          </Stack>
        </AdminDialogSection>
      </AdminDialogContent>

      <AdminDialogFooter>
        <AdminDialogCancelButton onClick={handleClose} disabled={isSaving}>
          {t('pages.pages.form.cancel')}
        </AdminDialogCancelButton>
        <AdminDialogPrimaryButton onClick={handleSaveClick} disabled={isSaving}>
          {isSaving ? t('pages.pages.form.saving') : t('pages.pages.form.save')}
        </AdminDialogPrimaryButton>
      </AdminDialogFooter>
    </AdminDialog>
  );
};
