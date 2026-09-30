import type { PaletteOptions } from '@mui/material/styles';
import type { ColorMode } from '../constants/colorMode';

declare module '@mui/material/styles' {
  interface Palette {
    utilityBar: Palette['primary'];
    footer: Palette['primary'];
    hero: Palette['primary'];
  }

  interface PaletteOptions {
    utilityBar?: PaletteOptions['primary'];
    footer?: PaletteOptions['primary'];
    hero?: PaletteOptions['primary'];
  }
}

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#1B75BC',
    light: '#6BACE0',
    dark: '#0E5A96',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#2980B9',
    light: '#85C1E9',
    dark: '#1A5276',
    contrastText: '#FFFFFF',
  },
  utilityBar: {
    main: '#6FB2D0',
    contrastText: '#FFFFFF',
  },
  footer: {
    main: '#f3f6f7',
    contrastText: '#1A5276',
  },
  hero: {
    main: '#4A9FD4',
    light: '#7EC0E8',
    dark: '#3589C5',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#5D6D7E',
  },
  divider: 'rgba(27, 117, 188, 0.12)',
};

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#6BACE0',
    light: '#85C1E9',
    dark: '#1B75BC',
    contrastText: '#0F1923',
  },
  secondary: {
    main: '#5DADE2',
    light: '#AED6F1',
    dark: '#2980B9',
    contrastText: '#0F1923',
  },
  utilityBar: {
    main: '#2E5570',
    contrastText: '#FFFFFF',
  },
  footer: {
    main: '#152A3A',
    contrastText: '#B8CDE0',
  },
  hero: {
    main: '#3589C5',
    light: '#4A9FD4',
    dark: '#1B75BC',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0F1923',
    paper: '#1A2733',
  },
  text: {
    primary: '#E8EDF2',
    secondary: '#A8B4C0',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};

const highContrastPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#CCCCCC',
    contrastText: '#000000',
  },
  secondary: {
    main: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#CCCCCC',
    contrastText: '#000000',
  },
  utilityBar: {
    main: '#000000',
    contrastText: '#FFFFFF',
  },
  footer: {
    main: '#000000',
    contrastText: '#FFFFFF',
  },
  hero: {
    main: '#000000',
    light: '#333333',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#000000',
    paper: '#000000',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
  },
  divider: 'rgba(255, 255, 255, 0.3)',
};

export const getPalette = (mode: ColorMode): PaletteOptions => {
  if (mode === 'high-contrast') return highContrastPalette;
  if (mode === 'dark') return darkPalette;
  return lightPalette;
};
