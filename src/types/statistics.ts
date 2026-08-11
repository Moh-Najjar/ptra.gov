export interface StatisticItem {
  id: string;
  value: string;
  labelKey: string;
  background: string;
}

export interface TranslatedStatisticItem extends Omit<StatisticItem, 'labelKey'> {
  label: string;
}

export interface DashboardCardItem {
  id: string;
  labelKey: string;
  path: string;
  background: string;
}
