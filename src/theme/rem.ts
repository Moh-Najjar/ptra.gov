import { BASE_FONT_SIZE_PX } from '../constants/fontSize';

/**
 * Convert a design-token pixel length to rem.
 * Root size is 16px at the default scale; public/styles.css and A+/A- scale html.
 */
export const rem = (px: number): string => {
  if (!Number.isFinite(px)) {
    throw new RangeError(`rem() expected a finite pixel value, received ${String(px)}`);
  }

  const remValue = px / BASE_FONT_SIZE_PX;
  return `${Number(remValue.toFixed(4))}rem`;
};
