import { useQuery } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { pagesService } from '../../services/pagesService';

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
