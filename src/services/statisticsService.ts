import type { ApiResponse } from '../types/api';
import type { GeneralCounterItem } from '../types/statistics';
import { apiClient } from './api/client';

interface RawGeneralCounterItem {
  id?: number;
  Id?: number;
  code?: string;
  Code?: string;
  value?: number;
  Value?: number;
  titleAr?: string;
  TitleAr?: string;
  titleEn?: string;
  TitleEn?: string;
}

const normalizeGeneralCounterItem = (
  item: RawGeneralCounterItem,
): GeneralCounterItem | null => {
  const id = item.id ?? item.Id;
  const code = item.code ?? item.Code;
  const value = item.value ?? item.Value;
  const titleAr = item.titleAr ?? item.TitleAr;
  const titleEn = item.titleEn ?? item.TitleEn;

  if (
    typeof id !== 'number' ||
    typeof code !== 'string' ||
    typeof value !== 'number' ||
    typeof titleAr !== 'string' ||
    typeof titleEn !== 'string'
  ) {
    return null;
  }

  return {
    id,
    code,
    value,
    titleAr,
    titleEn,
  };
};

export const statisticsService = {
  getGeneralStats: async (): Promise<GeneralCounterItem[]> => {
    const { data } = await apiClient.get<ApiResponse<RawGeneralCounterItem[]>>(
      '/Counters/general-information',
    );

    return data.data
      .map((item) => normalizeGeneralCounterItem(item))
      .filter((item): item is GeneralCounterItem => item !== null);
  },
};
