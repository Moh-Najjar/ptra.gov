import { useAdminPostsQuery, useAuthoredPostsQuery } from './queries/posts';
import { useAuth } from './useAuth';
import { useLanguage } from './useLanguage';

export const useAuthoredPosts = () => {
  const { isAuthenticated } = useAuth();
  return useAuthoredPostsQuery(isAuthenticated);
};

export const useAdminPosts = () => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  return useAdminPostsQuery(isAuthenticated, language);
};
