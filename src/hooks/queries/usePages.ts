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

export const getPagesTableLocale = (language: AppLanguage): string =>
  language === 'ar' ? 'ar-JO' : 'en-US';
