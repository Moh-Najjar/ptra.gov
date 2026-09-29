export const COLOR_MODE_STORAGE_KEY = 'ptra_color_mode';

export type ColorMode = 'light' | 'dark';

export const DEFAULT_COLOR_MODE: ColorMode = 'light';

const isColorMode = (value: string): value is ColorMode =>
  value === 'light' || value === 'dark';

export const getStoredColorMode = (): ColorMode => {
  const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (stored === null || !isColorMode(stored)) {
    return DEFAULT_COLOR_MODE;
  }
  return stored;
};

const GRAYSCALE_CLASS = 'grayscale';

/** Dark mode on this site is a grayscale filter, same as the original portal. */
export const applyColorMode = (mode: ColorMode): ColorMode => {
  const root = document.documentElement;
  const isGrayscale = mode === 'dark';

  root.dataset.colorMode = mode;
  root.style.colorScheme = 'light';
  root.classList.toggle(GRAYSCALE_CLASS, isGrayscale);
  return mode;
};
