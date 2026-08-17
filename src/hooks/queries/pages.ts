import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { pagesService } from '../../services/pagesService';
import type { PageDetailRecord } from '../../types/pageDetails';

export const pagesKeys = {
  list: ['pages', 'list'] as const,
  details: (pageId: number, pageNumber: number, pageSize: number) =>
    ['pages', 'details', pageId, pageNumber, pageSize] as const,
} as const;

export const usePagesQuery = (enabled: boolean, language: AppLanguage) =>
  useQuery({
    queryKey: [...pagesKeys.list, language] as const,
    queryFn: pagesService.getPages,
    enabled,
  });

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
