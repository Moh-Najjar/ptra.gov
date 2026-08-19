import { useApmscoMovementsQuery } from './queries/apmscoBerthing';
import {
  useAssignPageAuthorMutation,
  useCreatePageDetailMutation,
  usePageAuthorsQuery,
  usePageDetailsQuery,
  usePagesQuery,
  useRemovePageAuthorMutation,
  useSearchPageAuthorsQuery,
  useUpdatePageDetailMutation,
} from './queries/pages';
import { useAuth } from './useAuth';
import { useLanguage } from './useLanguage';

export { getPagesTableLocale } from '../utils/pages';

export const usePages = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  return usePagesQuery(isAuthenticated, language);
};

export const usePageDetails = (
  pageId: number | null,
  pageNumber: number,
  pageSize: number,
  detailsEnabled = true,
) => {
  const { isAuthenticated } = useAuth();
  return usePageDetailsQuery(
    isAuthenticated && detailsEnabled,
    pageId,
    pageNumber,
    pageSize,
  );
};

export const useCreatePageDetail = () => useCreatePageDetailMutation();

export const useUpdatePageDetail = () => useUpdatePageDetailMutation();

export const usePageAuthors = (pageId: number | null, enabled: boolean) => {
  const { isAuthenticated } = useAuth();
  return usePageAuthorsQuery(pageId, isAuthenticated && enabled);
};

export const useSearchPageAuthors = (query: string, enabled: boolean) => {
  const { isAuthenticated } = useAuth();
  return useSearchPageAuthorsQuery(query, isAuthenticated && enabled);
};

export const useAssignPageAuthor = () => useAssignPageAuthorMutation();

export const useRemovePageAuthor = () => useRemovePageAuthorMutation();

export const useApmscoMovements = (enabled: boolean) => {
  const { isAuthenticated } = useAuth();
  return useApmscoMovementsQuery(isAuthenticated && enabled);
};
