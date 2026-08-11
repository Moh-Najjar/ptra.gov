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

export const applyColorMode = (mode: ColorMode): ColorMode => {
  document.documentElement.dataset.colorMode = mode;
  document.documentElement.style.colorScheme = mode;
  return mode;
};
