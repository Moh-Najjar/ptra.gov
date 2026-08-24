export interface GeneralCounterItem {
  id: number;
  code: string;
  value: number;
  titleAr: string;
  titleEn: string;
}

/** Normalized website visitor counter from `/Counters/website-visitors`. */
export interface WebsiteVisitorCounter {
  key: string;
  value: number;
  displayNameEn: string;
  displayNameAr: string;
}

export interface TranslatedStatisticItem {
  id: number;
  /** Raw numeric value used for count-up animation. */
  numericValue: number;
  /** Digits after the decimal for English formatting / count-up. */
  fractionDigits: number;
  /** English-numeral formatted fallback (e.g. "1,234.5"). */
  value: string;
  label: string;
  background: string;
}

export interface DashboardCardItem {
  id: string;
  labelKey: string;
  descriptionKey: string;
  path: string;
  background: string;
}
