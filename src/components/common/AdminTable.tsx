import {
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  type SxProps,
  type Theme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { ReactNode } from 'react';

export const adminTableContainerSx: SxProps<Theme> = {
  borderRadius: 2,
  border: '0.0625rem solid',
  borderColor: 'divider',
  overflow: 'hidden',
};

export const adminTableHeadRowSx: SxProps<Theme> = (theme) => ({
  bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.08),
});

export const adminTableHeadCellSx: SxProps<Theme> = {
  fontWeight: 700,
  color: 'primary.main',
  whiteSpace: 'nowrap',
  borderBottom: '0.125rem solid',
  borderColor: 'primary.light',
};

export const getAdminTableInteractiveRowSx = (isInteractive: boolean): SxProps<Theme> =>
  isInteractive
    ? {
        cursor: 'pointer',
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
        },
      }
    : {};

interface AdminTableContainerProps {
  children: ReactNode;
}

export const AdminTableContainer = ({ children }: AdminTableContainerProps) => (
  <TableContainer component={Paper} sx={adminTableContainerSx}>
    {children}
  </TableContainer>
);

interface AdminTableHeadCellProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'inherit' | 'justify';
}

export const AdminTableHeadCell = ({ children, align }: AdminTableHeadCellProps) => (
  <TableCell sx={adminTableHeadCellSx} align={align}>
    {children}
  </TableCell>
);

interface AdminTableHeadRowProps {
  children: ReactNode;
}

export const AdminTableHeadRow = ({ children }: AdminTableHeadRowProps) => (
  <TableRow sx={adminTableHeadRowSx}>{children}</TableRow>
);
