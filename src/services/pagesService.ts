import type { ApiResponse } from '../types/api';
import type {
  AssignPageAuthorPayload,
  CmsPage,
  CreatePagePayload,
  PageAuthor,
  SearchablePageAuthor,
  UpdatePagePayload,
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
  content?: string | null;
  Content?: string | null;
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readStringField = (record: Record<string, unknown>, key: string): string | null => {
  const value = record[key];
  return typeof value === 'string' ? value : null;
};

/** GET /Pages/{id} returns PageDetailsDto; only Content is used for the edit form. */
const extractPageContent = (payload: unknown): string => {
  if (typeof payload === 'string') {
    return payload;
  }

  if (!isRecord(payload)) {
    return '';
  }

  return readStringField(payload, 'content') ?? readStringField(payload, 'Content') ?? '';
};

const normalizeCmsPage = (page: RawCmsPage): CmsPage => ({
  id: page.id,
  title: page.title,
  status: page.status,
  publishedDate: page.publishedDate,
  modifiedDate: page.modifiedDate,
  languageCode: page.languageCode,
  content: page.content ?? page.Content ?? null,
  isPageDetailsEnabled: page.isPageDetailsEnabled ?? page.IsPageDetailsEnabled ?? false,
  authors: normalizePageAuthors(page.authors ?? page.Authors),
});

export const pagesService = {
  getPages: async (): Promise<CmsPage[]> => {
    const { data } = await apiClient.get<ApiResponse<RawCmsPage[]>>('/Pages');
    return data.data.map(normalizeCmsPage);
  },

  getPageContent: async (pageId: number): Promise<string> => {
    const { data } = await apiClient.get<ApiResponse<unknown>>(`/Pages/${pageId}`);
    return extractPageContent(data.data);
  },

  createPage: async (payload: CreatePagePayload): Promise<CmsPage> => {
    const { data } = await apiClient.post<ApiResponse<RawCmsPage>>('/Pages', payload);
    return normalizeCmsPage(data.data);
  },

  updatePage: async (pageId: number, payload: UpdatePagePayload): Promise<CmsPage> => {
    const { data } = await apiClient.put<ApiResponse<RawCmsPage>>(`/Pages/${pageId}`, payload);
    return normalizeCmsPage(data.data);
  },

  deletePage: async (pageId: number): Promise<void> => {
    await apiClient.delete(`/Pages/${pageId}`);
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
