import { useQuery } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { rolesService } from '../../services/rolesService';

export const rolesKeys = {
  list: ['roles', 'list'] as const,
} as const;

export const useRolesQuery = (enabled: boolean, language: AppLanguage) =>
  useQuery({
    queryKey: [...rolesKeys.list, language] as const,
    queryFn: rolesService.getRoles,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
