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
