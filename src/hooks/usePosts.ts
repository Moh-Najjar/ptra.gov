import {
  useAdminPostsQuery,
  useAssignPostAuthorMutation,
  useAuthoredPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  usePostAuthorsQuery,
  useRemovePostAuthorMutation,
  useSearchPostAuthorsQuery,
  useUpdatePostMutation,
} from './queries/posts';
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

export const useCreatePost = () => useCreatePostMutation();

export const useUpdatePost = () => useUpdatePostMutation();

export const useDeletePost = () => useDeletePostMutation();

export const usePostAuthors = (postId: number | null, enabled: boolean) => {
  const { isAuthenticated } = useAuth();
  return usePostAuthorsQuery(postId, isAuthenticated && enabled);
};

export const useSearchPostAuthors = (query: string, enabled: boolean) => {
  const { isAuthenticated } = useAuth();
  return useSearchPostAuthorsQuery(query, isAuthenticated && enabled);
};

export const useAssignPostAuthor = () => useAssignPostAuthorMutation();

export const useRemovePostAuthor = () => useRemovePostAuthorMutation();
