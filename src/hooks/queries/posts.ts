import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AppLanguage } from '../../i18n/types';
import { postsService } from '../../services/postsService';
import type {
  AssignPostAuthorPayload,
  CreatePostPayload,
  UpdatePostPayload,
} from '../../types/posts';

export const postsKeys = {
  authored: ['posts', 'authored'] as const,
  list: ['posts', 'list'] as const,
  authors: (postId: number) => ['posts', postId, 'authors'] as const,
  authorSearch: (query: string) => ['posts', 'authors', 'search', query] as const,
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

export const usePostAuthorsQuery = (postId: number | null, enabled: boolean) =>
  useQuery({
    queryKey: postId === null ? ['posts', 'authors', 'idle'] : postsKeys.authors(postId),
    queryFn: () => postsService.getPostAuthors(postId as number),
    enabled: enabled && postId !== null,
  });

export const useSearchPostAuthorsQuery = (query: string, enabled: boolean) =>
  useQuery({
    queryKey: postsKeys.authorSearch(query),
    queryFn: () => postsService.searchAuthors(query),
    enabled: enabled && query.trim().length >= 2,
  });

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsService.createPost(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsKeys.list });
      await queryClient.invalidateQueries({ queryKey: postsKeys.authored });
    },
  });
};

interface UpdatePostVariables {
  postId: number;
  payload: UpdatePostPayload;
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: UpdatePostVariables) =>
      postsService.updatePost(postId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsKeys.list });
      await queryClient.invalidateQueries({ queryKey: postsKeys.authored });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => postsService.deletePost(postId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsKeys.list });
      await queryClient.invalidateQueries({ queryKey: postsKeys.authored });
    },
  });
};

interface AssignPostAuthorVariables {
  postId: number;
  payload: AssignPostAuthorPayload;
}

export const useAssignPostAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: AssignPostAuthorVariables) =>
      postsService.assignPostAuthor(postId, payload),
    onSuccess: async (authors, variables) => {
      queryClient.setQueryData(postsKeys.authors(variables.postId), authors);
      await queryClient.invalidateQueries({ queryKey: postsKeys.list });
    },
  });
};

interface RemovePostAuthorVariables {
  postId: number;
  userId: number;
}

export const useRemovePostAuthorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: RemovePostAuthorVariables) =>
      postsService.removePostAuthor(postId, userId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: postsKeys.authors(variables.postId) });
      await queryClient.invalidateQueries({ queryKey: postsKeys.list });
    },
  });
};
