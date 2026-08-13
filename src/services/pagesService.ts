import type { ApiResponse } from '../types/api';
import type { CmsPage } from '../types/cmsPage';
import type { PaginatedPageDetails } from '../types/pageDetails';
import { normalizePageDetailItems } from '../utils/pageDetails';
import { apiClient } from './api/client';

interface RawCmsPage {
  id: number;
  title: string;
  status: string;
  publishedDate: string;
  modifiedDate: string;
  languageCode: string | null;
  isPageDetailsEnabled?: boolean;
  IsPageDetailsEnabled?: boolean;
}

interface RawPaginatedPageDetails {
  items: unknown[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const normalizeCmsPage = (page: RawCmsPage): CmsPage => ({
  id: page.id,
  title: page.title,
  status: page.status,
  publishedDate: page.publishedDate,
  modifiedDate: page.modifiedDate,
  languageCode: page.languageCode,
  isPageDetailsEnabled: page.isPageDetailsEnabled ?? page.IsPageDetailsEnabled ?? false,
});

export const pagesService = {
  getPages: async (): Promise<CmsPage[]> => {
    const { data } = await apiClient.get<ApiResponse<RawCmsPage[]>>('/Pages');
    return data.data.map(normalizeCmsPage);
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
