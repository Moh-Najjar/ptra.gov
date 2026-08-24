import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
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
  POST_STATUSES,
  type PostFormValues,
  type PostStatus,
} from '../../types/posts';
import { getRequiredFieldError } from '../../utils/formValidation';
import { getValidationMessages } from '../../utils/validationMessages';

type PostFormMode = 'add' | 'edit';
type PostFieldErrors = Partial<Record<keyof PostFormValues, string>>;

interface PostFormDialogProps {
  open: boolean;
  mode: PostFormMode;
  formValues: PostFormValues;
  isSaving?: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: <K extends keyof PostFormValues>(field: K, value: PostFormValues[K]) => void;
}

export const PostFormDialog = ({
  open,
  mode,
  formValues,
  isSaving = false,
  onClose,
  onSave,
  onChange,
}: PostFormDialogProps) => {
  const { t } = useTranslation();
  const [fieldErrors, setFieldErrors] = useState<PostFieldErrors>({});

  const handleFieldChange = <K extends keyof PostFormValues>(
    field: K,
    value: PostFormValues[K],
  ) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
    onChange(field, value);
  };

  const handleSaveClick = () => {
    const messages = getValidationMessages(t);
    const nextErrors: PostFieldErrors = {
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
        title={mode === 'add' ? t('pages.post.addPost') : t('pages.post.editPost')}
        icon={mode === 'add' ? ArticleOutlinedIcon : EditOutlinedIcon}
        onClose={handleClose}
        closeLabel={t('pages.post.form.cancel')}
        closeDisabled={isSaving}
      />

      <AdminDialogContent>
        <AdminDialogSection>
          <Stack spacing={2.5}>
            <TextField
              label={t('pages.post.form.title')}
              value={formValues.title}
              onChange={(event) => handleFieldChange('title', event.target.value)}
              fullWidth
              required
              error={Boolean(fieldErrors.title)}
              helperText={fieldErrors.title}
              disabled={isSaving}
            />

            <TextField
              label={t('pages.post.form.content')}
              value={formValues.content}
              onChange={(event) => handleFieldChange('content', event.target.value)}
              fullWidth
              required
              multiline
              minRows={6}
              error={Boolean(fieldErrors.content)}
              helperText={fieldErrors.content ?? t('pages.post.form.contentHint')}
              disabled={isSaving}
            />

            <FormControl fullWidth required error={Boolean(fieldErrors.status)} disabled={isSaving}>
              <InputLabel id="post-status-label">{t('pages.post.form.status')}</InputLabel>
              <Select
                labelId="post-status-label"
                label={t('pages.post.form.status')}
                value={formValues.status}
                onChange={(event) => handleFieldChange('status', event.target.value as PostStatus)}
              >
                {POST_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {t(`pages.post.status.${status}`)}
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
          {t('pages.post.form.cancel')}
        </AdminDialogCancelButton>
        <AdminDialogPrimaryButton onClick={handleSaveClick} disabled={isSaving}>
          {isSaving ? t('pages.post.form.saving') : t('pages.post.form.save')}
        </AdminDialogPrimaryButton>
      </AdminDialogFooter>
    </AdminDialog>
  );
};
