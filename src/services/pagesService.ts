import type { ApiResponse } from '../types/api';
import type { CmsPage } from '../types/cmsPage';
import type { PaginatedPageDetails } from '../types/pageDetails';
import { apiClient } from './api/client';

export const pagesService = {
  getPages: async (): Promise<CmsPage[]> => {
    const { data } = await apiClient.get<ApiResponse<CmsPage[]>>('/Pages');
    return data.data;
  },

  getPageDetails: async (
    pageId: number,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginatedPageDetails> => {
    const { data } = await apiClient.get<ApiResponse<PaginatedPageDetails>>(
      `/pageDetails/${pageId}`,
      {
        params: {
          pageNumber,
          pageSize,
        },
      },
    );

    return data.data;
  },
};
