import type { ApiResponse } from '../types/api';
import type {
  AssignPageAuthorPayload,
  CmsPage,
  PageAuthor,
  SearchablePageAuthor,
} from '../types/cmsPage';
import type { PageDetailRecord, PaginatedPageDetails } from '../types/pageDetails';
import { normalizePageDetailItem, normalizePageDetailItems } from '../utils/pageDetails';
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
  authors?: RawPageAuthor[];
  Authors?: RawPageAuthor[];
}

interface RawPageAuthor {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  slug?: string;
  Slug?: string;
}

interface RawSearchablePageAuthor {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  email?: string;
  Email?: string;
}

interface RawPaginatedPageDetails {
  items: unknown[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const normalizePageAuthor = (author: RawPageAuthor): PageAuthor | null => {
  const id = author.id ?? author.Id;
  const name = author.name ?? author.Name;
  const slug = author.slug ?? author.Slug;

  if (typeof id !== 'number' || typeof name !== 'string' || typeof slug !== 'string') {
    return null;
  }

  return { id, name, slug };
};

const normalizeSearchablePageAuthor = (
  author: RawSearchablePageAuthor,
): SearchablePageAuthor | null => {
  const id = author.id ?? author.Id;
  const name = author.name ?? author.Name;
  const email = author.email ?? author.Email;

  if (typeof id !== 'number' || typeof name !== 'string' || typeof email !== 'string') {
    return null;
  }

  return { id, name, email };
};

const normalizePageAuthors = (authors: RawPageAuthor[] | undefined): PageAuthor[] => {
  if (!authors) {
    return [];
  }

  return authors
    .map((author) => normalizePageAuthor(author))
    .filter((author): author is PageAuthor => author !== null);
};

const normalizeCmsPage = (page: RawCmsPage): CmsPage => ({
  id: page.id,
  title: page.title,
  status: page.status,
  publishedDate: page.publishedDate,
  modifiedDate: page.modifiedDate,
  languageCode: page.languageCode,
  isPageDetailsEnabled: page.isPageDetailsEnabled ?? page.IsPageDetailsEnabled ?? false,
  authors: normalizePageAuthors(page.authors ?? page.Authors),
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

  createPageDetail: async (
    pageId: number,
    payload: PageDetailRecord,
  ): Promise<PageDetailRecord> => {
    const { data } = await apiClient.post<ApiResponse<unknown>>(
      `/pageDetails/${pageId}`,
      payload,
    );

    const normalized = normalizePageDetailItem(data.data);
    if (normalized === null) {
      throw new Error('Invalid page detail create response.');
    }

    return normalized;
  },

  updatePageDetail: async (
    pageId: number,
    recordId: number,
    payload: PageDetailRecord,
  ): Promise<PageDetailRecord> => {
    const { data } = await apiClient.put<ApiResponse<unknown>>(
      `/pageDetails/${pageId}/${recordId}`,
      payload,
    );

    const normalized = normalizePageDetailItem(data.data);
    if (normalized === null) {
      throw new Error('Invalid page detail update response.');
    }

    return normalized;
  },

  getPageAuthors: async (pageId: number): Promise<PageAuthor[]> => {
    const { data } = await apiClient.get<ApiResponse<RawPageAuthor[]>>(`/pages/${pageId}/authors`);

    return data.data
      .map((author) => normalizePageAuthor(author))
      .filter((author): author is PageAuthor => author !== null);
  },

  searchPageAuthors: async (query: string): Promise<SearchablePageAuthor[]> => {
    const { data } = await apiClient.get<ApiResponse<RawSearchablePageAuthor[]>>(
      '/pages/authors/search',
      {
        params: { query },
      },
    );

    return data.data
      .map((author) => normalizeSearchablePageAuthor(author))
      .filter((author): author is SearchablePageAuthor => author !== null);
  },

  assignPageAuthor: async (
    pageId: number,
    payload: AssignPageAuthorPayload,
  ): Promise<PageAuthor[]> => {
    const { data } = await apiClient.post<ApiResponse<RawPageAuthor[]>>(
      `/pages/${pageId}/authors`,
      payload,
    );

    return data.data
      .map((author) => normalizePageAuthor(author))
      .filter((author): author is PageAuthor => author !== null);
  },

  removePageAuthor: async (pageId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/pages/${pageId}/authors/${userId}`);
  },
};
