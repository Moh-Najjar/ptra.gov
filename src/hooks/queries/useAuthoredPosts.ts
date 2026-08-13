import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../useAuth';
import { postsService } from '../../services/postsService';
import { postsKeys } from './postsKeys';

export const useAuthoredPosts = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: postsKeys.authored,
    queryFn: postsService.getAuthoredPosts,
    enabled: isAuthenticated,
  });
};
