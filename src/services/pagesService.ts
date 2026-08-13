import type { ApiResponse } from '../types/api';
import type { CmsPage } from '../types/cmsPage';
import { apiClient } from './api/client';

export const pagesService = {
  getPages: async (): Promise<CmsPage[]> => {
    const { data } = await apiClient.get<ApiResponse<CmsPage[]>>('/Pages');
    return data.data;
  },
};
