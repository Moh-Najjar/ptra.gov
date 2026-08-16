export interface GeneralCounterItem {
  id: number;
  code: string;
  value: number;
  titleAr: string;
  titleEn: string;
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
  path: string;
  background: string;
}
