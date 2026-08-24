/** Options for system-wide English (Latin-digit) number formatting. */
export interface FormatSystemNumberOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formats numbers with Western Arabic (English) digits for every UI language.
 * Use this for counters, charts, pagination labels, and other system values.
 */
export const formatSystemNumber = (
  value: number,
  options: FormatSystemNumberOptions = {},
): string => {
  // Reject non-finite input so callers never render "NaN" / "Infinity".
  if (!Number.isFinite(value)) {
    return '0';
  }

  const minimumFractionDigits = options.minimumFractionDigits ?? 0;
  const maximumFractionDigits = options.maximumFractionDigits ?? minimumFractionDigits;

  return new Intl.NumberFormat('en-US', {
    numberingSystem: 'latn',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};
