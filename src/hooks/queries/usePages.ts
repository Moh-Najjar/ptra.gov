import { useQuery } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { pagesService } from '../../services/pagesService';
import { useAuth } from '../useAuth';
import { useLanguage } from '../useLanguage';
import { pagesKeys } from './pagesKeys';

export const usePages = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();

  return useQuery({
    queryKey: [...pagesKeys.list, language] as const,
    queryFn: pagesService.getPages,
    enabled: isAuthenticated,
  });
};

export const usePageDetails = (
  pageId: number | null,
  pageNumber: number,
  pageSize: number,
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey:
      pageId === null
        ? ['pages', 'details', 'idle']
        : pagesKeys.details(pageId, pageNumber, pageSize),
    queryFn: () => pagesService.getPageDetails(pageId as number, pageNumber, pageSize),
    enabled: isAuthenticated && pageId !== null,
  });
};

export const getPagesTableLocale = (language: AppLanguage): string =>
  language === 'ar' ? 'ar-JO' : 'en-US';

