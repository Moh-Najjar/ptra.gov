import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
  type ButtonProps,
  type DialogProps,
} from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import type { ElementType, ReactNode } from 'react';

type AdminDialogHeaderTone = 'primary' | 'error';

const getAdminDialogPaperSx = (theme: Theme) => ({
  borderRadius: 3,
  overflow: 'hidden',
  boxShadow: `0 16px 40px ${alpha(theme.palette.primary.main, 0.18)}`,
});

const getAdminDialogContentSx = (theme: Theme) => ({
  px: 3,
  py: 3,
  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.03 : 0.012),
});

const getAdminDialogFooterSx = (theme: Theme) => ({
  px: 3,
  py: 2,
  gap: 1,
  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.04 : 0.018),
});

export const adminDialogSectionSx = {
  p: 2,
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: (theme: Theme) =>
    alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.05 : 0.02),
} as const;

export const adminDialogCancelButtonSx = {
  color: 'text.secondary',
  fontWeight: 600,
} as const;

export const adminDialogPrimaryButtonSx = {
  px: 2.5,
  fontWeight: 700,
  boxShadow: (theme: Theme) => `0 8px 20px ${alpha(theme.palette.primary.main, 0.28)}`,
} as const;

export const adminDialogDangerButtonSx = {
  px: 2.5,
  fontWeight: 700,
  boxShadow: (theme: Theme) => `0 8px 20px ${alpha(theme.palette.error.main, 0.24)}`,
} as const;

interface AdminDialogProps extends DialogProps {
  children: ReactNode;
}

export const AdminDialog = ({ children, slotProps, ...props }: AdminDialogProps) => (
  <Dialog
    {...props}
    slotProps={{
      ...slotProps,
      paper: {
        sx: getAdminDialogPaperSx,
      },
    }}
  >
    {children}
  </Dialog>
);

interface AdminDialogHeaderProps {
  title: string;
  subtitle?: string;
  icon: ElementType;
  onClose?: () => void;
  closeLabel?: string;
  closeDisabled?: boolean;
  tone?: AdminDialogHeaderTone;
  action?: ReactNode;
}

export const AdminDialogHeader = ({
  title,
  subtitle,
  icon: HeaderIcon,
  onClose,
  closeLabel = 'Close',
  closeDisabled = false,
  tone = 'primary',
  action,
}: AdminDialogHeaderProps) => {
  const headerColor = tone === 'error' ? 'error.main' : 'primary.main';
  const headerContrast = tone === 'error' ? 'error.contrastText' : 'primary.contrastText';

  return (
    <Box
      sx={{
        position: 'relative',
        px: 3,
        py: 2.5,
        bgcolor: headerColor,
        color: headerContrast,
      }}
    >
      {onClose && (
        <Stack
          spacing={1}
          sx={{
            position: 'absolute',
            top: 8,
            insetInlineEnd: 8,
            alignItems: 'stretch',
            zIndex: 1,
          }}
        >
          <IconButton
            aria-label={closeLabel}
            onClick={onClose}
            disabled={closeDisabled}
            sx={{
              alignSelf: 'flex-end',
              color: 'inherit',
              bgcolor: alpha('#FFFFFF', 0.12),
              '&:hover': {
                bgcolor: alpha('#FFFFFF', 0.22),
              },
            }}
          >
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
          {action}
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          minWidth: 0,
          flex: 1,
          pe: onClose || action ? { xs: 2, sm: 18 } : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 2,
            flexShrink: 0,
            bgcolor: alpha('#FFFFFF', 0.16),
            border: '1px solid',
            borderColor: alpha('#FFFFFF', 0.28),
          }}
        >
          <HeaderIcon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.92, mt: 0.25 }} noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

interface AdminDialogContentProps {
  children: ReactNode;
  disablePadding?: boolean;
}

export const AdminDialogContent = ({
  children,
  disablePadding = false,
}: AdminDialogContentProps) => (
  <DialogContent
    sx={(theme) => ({
      ...getAdminDialogContentSx(theme),
      ...(disablePadding ? { px: 0, py: 0 } : {}),
    })}
  >
    {children}
  </DialogContent>
);

interface AdminDialogSectionProps {
  children: ReactNode;
  title?: string;
  icon?: ElementType;
  action?: ReactNode;
}

export const AdminDialogSection = ({
  children,
  title,
  icon: SectionIcon,
  action,
}: AdminDialogSectionProps) => (
  <Box sx={adminDialogSectionSx}>
    {title && (
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', mb: 1.5, color: 'primary.main' }}
      >
        {SectionIcon && <SectionIcon fontSize="small" />}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1 }}>
          {title}
        </Typography>
        {action}
      </Stack>
    )}
    {children}
  </Box>
);

interface AdminDialogFooterProps {
  children: ReactNode;
}

export const AdminDialogFooter = ({ children }: AdminDialogFooterProps) => (
  <>
    <Divider />
    <DialogActions sx={getAdminDialogFooterSx}>{children}</DialogActions>
  </>
);

export const AdminDialogCancelButton = (props: ButtonProps) => (
  <Button {...props} sx={[adminDialogCancelButtonSx, ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : [])]} />
);

export const AdminDialogPrimaryButton = (props: ButtonProps) => (
  <Button
    variant="contained"
    {...props}
    sx={[adminDialogPrimaryButtonSx, ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : [])]}
  />
);

export const AdminDialogDangerButton = (props: ButtonProps) => (
  <Button
    variant="contained"
    color="error"
    {...props}
    sx={[adminDialogDangerButtonSx, ...(Array.isArray(props.sx) ? props.sx : props.sx ? [props.sx] : [])]}
  />
);
