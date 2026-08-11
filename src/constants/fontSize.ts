export const FONT_SIZE_STORAGE_KEY = 'ptra_font_size_level';

export const BASE_FONT_SIZE_PX = 16;

export const MIN_FONT_SIZE_LEVEL = -3;

export const MAX_FONT_SIZE_LEVEL = 3;

export const FONT_SIZE_STEP_RATIO = 0.125;

export const DEFAULT_FONT_SIZE_LEVEL = 0;

export const clampFontSizeLevel = (level: number): number =>
  Math.min(MAX_FONT_SIZE_LEVEL, Math.max(MIN_FONT_SIZE_LEVEL, Math.round(level)));

export const getFontSizeScale = (level: number): number =>
  1 + clampFontSizeLevel(level) * FONT_SIZE_STEP_RATIO;

export const getRootFontSizePx = (level: number): number =>
  BASE_FONT_SIZE_PX * getFontSizeScale(level);

export const getStoredFontSizeLevel = (): number => {
  const stored = localStorage.getItem(FONT_SIZE_STORAGE_KEY);
  if (stored === null) {
    return DEFAULT_FONT_SIZE_LEVEL;
  }
  const parsed = Number.parseInt(stored, 10);
  if (Number.isNaN(parsed)) {
    return DEFAULT_FONT_SIZE_LEVEL;
  }
  return clampFontSizeLevel(parsed);
};

export const applyFontSizeLevel = (level: number): number => {
  const clampedLevel = clampFontSizeLevel(level);
  const rootFontSizePx = getRootFontSizePx(clampedLevel);
  document.documentElement.style.fontSize = `${rootFontSizePx}px`;
  document.documentElement.dataset.fontSizeLevel = String(clampedLevel);
  return clampedLevel;
};
