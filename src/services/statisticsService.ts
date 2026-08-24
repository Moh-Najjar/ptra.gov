import type { ApiResponse } from '../types/api';
import type { GeneralCounterItem, WebsiteVisitorCounter } from '../types/statistics';
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

interface RawLocalizedDisplayName {
  en?: string;
  En?: string;
  ar?: string;
  Ar?: string;
  value?: string;
  Value?: string;
}

interface RawWebsiteVisitorCounter {
  key?: string;
  Key?: string;
  value?: number;
  Value?: number;
  displayName?: RawLocalizedDisplayName;
  DisplayName?: RawLocalizedDisplayName;
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

const normalizeWebsiteVisitorCounter = (
  item: RawWebsiteVisitorCounter,
): WebsiteVisitorCounter | null => {
  // Accept both camelCase and PascalCase payloads from the API.
  const key = item.key ?? item.Key;
  const value = item.value ?? item.Value;
  const displayName = item.displayName ?? item.DisplayName;
  const displayNameEn = displayName?.en ?? displayName?.En ?? displayName?.value ?? displayName?.Value;
  const displayNameAr = displayName?.ar ?? displayName?.Ar ?? displayName?.value ?? displayName?.Value;

  if (
    typeof key !== 'string' ||
    typeof value !== 'number' ||
    typeof displayNameEn !== 'string' ||
    typeof displayNameAr !== 'string'
  ) {
    return null;
  }

  return {
    key,
    value,
    displayNameEn,
    displayNameAr,
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

  getWebsiteVisitors: async (): Promise<WebsiteVisitorCounter> => {
    const { data } = await apiClient.get<ApiResponse<RawWebsiteVisitorCounter>>(
      '/Counters/website-visitors',
    );

    const normalized = normalizeWebsiteVisitorCounter(data.data);

    if (normalized === null) {
      throw new Error('Invalid website visitor counter response.');
    }

    return normalized;
  },
};
