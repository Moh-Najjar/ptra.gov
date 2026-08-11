import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { statisticsService } from '../../services/statisticsService';
import type { TranslatedStatisticItem } from '../../types/statistics';

export const GENERAL_STATS_QUERY_KEY = ['generalStats'] as const;

export const useGeneralStats = () => {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: GENERAL_STATS_QUERY_KEY,
    queryFn: statisticsService.getGeneralStats,
  });

  const data = useMemo<TranslatedStatisticItem[] | undefined>(() => {
    if (!query.data) {
      return undefined;
    }
    return query.data.map((stat) => ({
      id: stat.id,
      value: stat.value,
      background: stat.background,
      label: t(stat.labelKey),
    }));
  }, [query.data, t]);

  return {
    ...query,
    data,
  };
};
