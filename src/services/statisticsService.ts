import { GENERAL_STATISTICS } from '../constants/statistics';
import type { StatisticItem } from '../types/statistics';
// import { apiClient } from './api/client';

export const statisticsService = {
  getGeneralStats: async (): Promise<StatisticItem[]> => {
    // TODO: replace with API call when backend is ready
    // const { data } = await apiClient.get<StatisticItem[]>('/statistics/general');
    // return data;
    return Promise.resolve(GENERAL_STATISTICS);
  },
};
