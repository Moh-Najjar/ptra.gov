import { useGeneralStatsQuery } from './queries/stats';
import { useLanguage } from './useLanguage';

export const useGeneralStats = () => {
  const { language } = useLanguage();
  return useGeneralStatsQuery(language);
};
