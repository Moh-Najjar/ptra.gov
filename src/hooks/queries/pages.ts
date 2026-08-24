import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { pagesService } from '../../services/pagesService';
import type {
  AssignPageAuthorPayload,
  CreatePagePayload,
  UpdatePagePayload,
} from '../../types/cmsPage';
import type { PageDetailRecord } from '../../types/pageDetails';

export const pagesKeys = {
  list: ['pages', 'list'] as const,
  details: (pageId: number, pageNumber: number, pageSize: number) =>
    ['pages', 'details', pageId, pageNumber, pageSize] as const,
  authors: (pageId: number) => ['pages', pageId, 'authors'] as const,
  authorSearch: (query: string) => ['pages', 'authors', 'search', query] as const,
} as const;

export const usePagesQuery = (enabled: boolean, language: AppLanguage) =>
  useQuery({
    queryKey: [...pagesKeys.list, language] as const,
    queryFn: pagesService.getPages,
    enabled,
  });

export const useCreatePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePagePayload) => pagesService.createPage(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pagesKeys.list });
    },
  });
};

interface UpdatePageVariables {
  pageId: number;
  payload: UpdatePagePayload;
}

export const useUpdatePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, payload }: UpdatePageVariables) =>
      pagesService.updatePage(pageId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pagesKeys.list });
    },
  });
};

export const useDeletePageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageId: number) => pagesService.deletePage(pageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: pagesKeys.list });
    },
  });
};

export const usePageDetailsQuery = (
  enabled: boolean,
  pageId: number | null,
  pageNumber: number,
  pageSize: number,
) =>
  useQuery({
    queryKey:
      pageId === null
        ? (['pages', 'details', 'idle'] as const)
        : pagesKeys.details(pageId, pageNumber, pageSize),
    queryFn: () => pagesService.getPageDetails(pageId as number, pageNumber, pageSize),
    enabled: enabled && pageId !== null,
  });

interface CreatePageDetailVariables {
  pageId: number;
  pageNumber: number;
  pageSize: number;
  payload: PageDetailRecord;
}

interface UpdatePageDetailVariables {
  pageId: number;
  recordId: number;
  pageNumber: number;
  pageSize: number;
  payload: PageDetailRecord;
}

const invalidatePageDetails = async (
  queryClient: ReturnType<typeof useQueryClient>,
  pageId: number,
  pageNumber: number,
  pageSize: number,
): Promise<void> => {
  await queryClient.invalidateQueries({
    queryKey: pagesKeys.details(pageId, pageNumber, pageSize),
  });
};

export const useCreatePageDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, payload }: CreatePageDetailVariables) =>
      pagesService.createPageDetail(pageId, payload),
    onSuccess: async (_data, variables) => {
      await invalidatePageDetails(
        queryClient,
        variables.pageId,
        variables.pageNumber,
        variables.pageSize,
      );
    },
  });
};

export const useUpdatePageDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, recordId, payload }: UpdatePageDetailVariables) =>
      pagesService.updatePageDetail(pageId, recordId, payload),
    onSuccess: async (_data, variables) => {
      await invalidatePageDetails(
        queryClient,
        variables.pageId,
        variables.pageNumber,
        variables.pageSize,
      );
    },
  });
};

export const usePageAuthorsQuery = (pageId: number | null, enabled: boolean) =>
  useQuery({
    queryKey: pageId === null ? ['pages', 'authors', 'idle'] : pagesKeys.authors(pageId),
    queryFn: () => pagesService.getPageAuthors(pageId as number),
    enabled: enabled && pageId !== null,
  });

export const useSearchPageAuthorsQuery = (query: string, enabled: boolean) =>
  useQuery({
    queryKey: pagesKeys.authorSearch(query),
    queryFn: () => pagesService.searchPageAuthors(query),
    enabled: enabled && query.trim().length >= 2,
  });

interface AssignPageAuthorVariables {
  pageId: number;
  payload: AssignPageAuthorPayload;
}

export const useAssignPageAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, payload }: AssignPageAuthorVariables) =>
      pagesService.assignPageAuthor(pageId, payload),
    onSuccess: async (authors, variables) => {
      queryClient.setQueryData(pagesKeys.authors(variables.pageId), authors);
      await queryClient.invalidateQueries({ queryKey: pagesKeys.list });
    },
  });
};

interface RemovePageAuthorVariables {
  pageId: number;
  userId: number;
}

export const useRemovePageAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, userId }: RemovePageAuthorVariables) =>
      pagesService.removePageAuthor(pageId, userId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: pagesKeys.authors(variables.pageId) });
      await queryClient.invalidateQueries({ queryKey: pagesKeys.list });
    },
  });
};
