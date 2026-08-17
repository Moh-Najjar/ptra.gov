import { useApmscoMovementsQuery } from './queries/apmscoBerthing';
import {
  useCreatePageDetailMutation,
  usePageDetailsQuery,
  usePagesQuery,
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

export const useApmscoMovements = (enabled: boolean) => {
  const { isAuthenticated } = useAuth();
  return useApmscoMovementsQuery(isAuthenticated && enabled);
};
