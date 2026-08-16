import { useQuery } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { postsService } from '../../services/postsService';

export const postsKeys = {
  authored: ['posts', 'authored'] as const,
  list: ['posts', 'list'] as const,
} as const;

export const useAuthoredPostsQuery = (enabled: boolean) =>
  useQuery({
    queryKey: postsKeys.authored,
    queryFn: postsService.getAuthoredPosts,
    enabled,
  });

export const useAdminPostsQuery = (enabled: boolean, language: AppLanguage) =>
  useQuery({
    queryKey: [...postsKeys.list, language] as const,
    queryFn: postsService.getPosts,
    enabled,
  });
