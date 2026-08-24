import { useQuery } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { statisticsService } from '../../services/statisticsService';
import {
  getGeneralStatsLocale,
  mapGeneralCountersToDisplayItems,
} from '../../utils/generalStats';

export const statsKeys = {
  general: ['generalStats'] as const,
  websiteVisitors: ['websiteVisitors'] as const,
} as const;

export const useGeneralStatsQuery = (language: AppLanguage) =>
  useQuery({
    queryKey: [...statsKeys.general, language] as const,
    queryFn: statisticsService.getGeneralStats,
    staleTime: 5 * 60 * 1000,
    select: (data) => mapGeneralCountersToDisplayItems(data, language),
  });

export const useWebsiteVisitorsQuery = (language: AppLanguage) =>
  useQuery({
    queryKey: [...statsKeys.websiteVisitors, language] as const,
    queryFn: statisticsService.getWebsiteVisitors,
    staleTime: 5 * 60 * 1000,
    // Format the raw count for the active locale (e.g. Arabic digits when ar).
    select: (data) =>
      new Intl.NumberFormat(getGeneralStatsLocale(language), {
        maximumFractionDigits: 0,
      }).format(data.value),
  });
