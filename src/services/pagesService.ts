import type { ApiResponse } from '../types/api';
import type { CmsPage } from '../types/cmsPage';
import type { PaginatedPageDetails } from '../types/pageDetails';
import { normalizePageDetailItems } from '../utils/pageDetails';
import { apiClient } from './api/client';

interface RawPaginatedPageDetails {
  items: unknown[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

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
    const { data } = await apiClient.get<ApiResponse<RawPaginatedPageDetails>>(
      `/pageDetails/${pageId}`,
      {
        params: {
          pageNumber,
          pageSize,
        },
      },
    );

    return {
      items: normalizePageDetailItems(data.data.items),
      pageNumber: data.data.pageNumber,
      pageSize: data.data.pageSize,
      totalCount: data.data.totalCount,
      totalPages: data.data.totalPages,
    };
  },
};
