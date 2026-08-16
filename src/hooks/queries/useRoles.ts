import { useQuery } from '@tanstack/react-query';
import { rolesService } from '../../services/rolesService';
import { useAuth } from '../useAuth';
import { useLanguage } from '../useLanguage';
import { rolesKeys } from './rolesKeys';

export const useRoles = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();

  return useQuery({
    queryKey: [...rolesKeys.list, language] as const,
    queryFn: rolesService.getRoles,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};
