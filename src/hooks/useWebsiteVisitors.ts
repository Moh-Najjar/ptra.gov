import { useWebsiteVisitorsQuery } from './queries/stats';
import { useLanguage } from './useLanguage';

/** Fetches and formats the website visitor counter for the active language. */
export const useWebsiteVisitors = () => {
  const { language } = useLanguage();
  return useWebsiteVisitorsQuery(language);
};
