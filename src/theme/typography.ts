import type { ThemeOptions } from '@mui/material/styles';

export const typography: ThemeOptions['typography'] = {
  fontFamily: '"Cairo", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '2.4rem',
    lineHeight: 1.25,
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3,
  },
  h3: {
    fontWeight: 700,
    fontSize: '1.6rem',
    lineHeight: 1.35,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.35rem',
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.29rem',
    lineHeight: 1.45,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.19rem',
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1.09rem',
    lineHeight: 1.7,
  },
  body2: {
    fontSize: '0.99rem',
    lineHeight: 1.6,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
  },
};
