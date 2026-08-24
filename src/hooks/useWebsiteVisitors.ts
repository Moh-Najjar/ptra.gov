import { useWebsiteVisitorsQuery } from './queries/stats';

/** Fetches the website visitor counter formatted with English digits. */
export const useWebsiteVisitors = () => useWebsiteVisitorsQuery();
