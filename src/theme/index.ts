import { createTheme, type Direction } from '@mui/material/styles';
import type { ColorMode } from '../constants/colorMode';
import { getPalette } from './palette';
import { rem } from './rem';
import { typography } from './typography';

export const createAppTheme = (direction: Direction, mode: ColorMode) =>
  createTheme({
    direction,
    palette: getPalette(mode),
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: rem(8),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiLink: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: theme.palette.primary.main,
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) =>
            theme.palette.mode === 'dark'
              ? {
                  backgroundImage: 'none',
                }
              : {},
        },
      },
    },
  });
