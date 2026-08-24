import { useQuery } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { statisticsService } from '../../services/statisticsService';
import { formatSystemNumber } from '../../utils/formatNumber';
import { mapGeneralCountersToDisplayItems } from '../../utils/generalStats';

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

export const useWebsiteVisitorsQuery = () =>
  useQuery({
    queryKey: statsKeys.websiteVisitors,
    queryFn: statisticsService.getWebsiteVisitors,
    staleTime: 5 * 60 * 1000,
    // Always English/Latin digits, regardless of UI language.
    select: (data) => formatSystemNumber(data.value),
  });
