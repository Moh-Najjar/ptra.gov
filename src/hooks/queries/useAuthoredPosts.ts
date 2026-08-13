import { useQuery } from '@tanstack/react-query';
import { postsService } from '../../services/postsService';
import { useAuth } from '../useAuth';
import { useLanguage } from '../useLanguage';
import { postsKeys } from './postsKeys';

export const useAuthoredPosts = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: postsKeys.authored,
    queryFn: postsService.getAuthoredPosts,
    enabled: isAuthenticated,
  });
};

export const useAdminPosts = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();

  return useQuery({
    queryKey: [...postsKeys.list, language] as const,
    queryFn: postsService.getPosts,
    enabled: isAuthenticated,
  });
};
