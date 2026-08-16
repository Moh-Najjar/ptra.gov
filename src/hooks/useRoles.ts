import { useRolesQuery } from './queries/roles';
import { useAuth } from './useAuth';
import { useLanguage } from './useLanguage';

export const useRoles = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  return useRolesQuery(isAuthenticated, language);
};
