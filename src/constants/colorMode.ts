export const COLOR_MODE_STORAGE_KEY = 'ptra_color_mode';

export type ColorMode = 'light' | 'dark' | 'high-contrast';

export const DEFAULT_COLOR_MODE: ColorMode = 'light';

const isColorMode = (value: string): value is ColorMode =>
  value === 'light' || value === 'dark' || value === 'high-contrast';

export const getStoredColorMode = (): ColorMode => {
  const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (stored === null || !isColorMode(stored)) {
    return DEFAULT_COLOR_MODE;
  }
  return stored;
};

const GRAYSCALE_CLASS = 'grayscale';
const HIGH_CONTRAST_CLASS = 'high-contrast';

/** Apply color mode: light (normal), dark (grayscale), or high-contrast (black/white). */
export const applyColorMode = (mode: ColorMode): ColorMode => {
  const root = document.documentElement;
  const isGrayscale = mode === 'dark';
  const isHighContrast = mode === 'high-contrast';

  root.dataset.colorMode = mode;
  root.style.colorScheme = isHighContrast ? 'dark' : 'light';
  root.classList.toggle(GRAYSCALE_CLASS, isGrayscale);
  root.classList.toggle(HIGH_CONTRAST_CLASS, isHighContrast);
  return mode;
};
