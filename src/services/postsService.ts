import type { ApiResponse } from '../types/api';
import type {
  AdminPost,
  AssignPostAuthorPayload,
  AuthoredPost,
  CreatePostPayload,
  PostAuthor,
  SearchablePostAuthor,
  UpdatePostPayload,
} from '../types/posts';
import { apiClient } from './api/client';

interface RawPostAuthor {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  slug?: string;
  Slug?: string;
}

interface RawSearchablePostAuthor {
  id?: number;
  Id?: number;
  name?: string;
  Name?: string;
  email?: string;
  Email?: string;
}

const normalizePostAuthor = (author: RawPostAuthor): PostAuthor | null => {
  const id = author.id ?? author.Id;
  const name = author.name ?? author.Name;
  const slug = author.slug ?? author.Slug;

  if (typeof id !== 'number' || typeof name !== 'string' || typeof slug !== 'string') {
    return null;
  }

  return { id, name, slug };
};

const normalizeSearchablePostAuthor = (
  author: RawSearchablePostAuthor,
): SearchablePostAuthor | null => {
  const id = author.id ?? author.Id;
  const name = author.name ?? author.Name;
  const email = author.email ?? author.Email;

  if (typeof id !== 'number' || typeof name !== 'string' || typeof email !== 'string') {
    return null;
  }

  return { id, name, email };
};

export const postsService = {
  getAuthoredPosts: async (): Promise<AuthoredPost[]> => {
    const { data } = await apiClient.get<ApiResponse<AuthoredPost[]>>('/posts/me/authored');
    return data.data;
  },

  getPosts: async (): Promise<AdminPost[]> => {
    const { data } = await apiClient.get<ApiResponse<AdminPost[]>>('/posts');
    return data.data;
  },

  createPost: async (payload: CreatePostPayload): Promise<AdminPost> => {
    const { data } = await apiClient.post<ApiResponse<AdminPost>>('/Posts', payload);
    return data.data;
  },

  updatePost: async (postId: number, payload: UpdatePostPayload): Promise<AdminPost> => {
    const { data } = await apiClient.put<ApiResponse<AdminPost>>(`/Posts/${postId}`, payload);
    return data.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/Posts/${postId}`);
  },

  getPostAuthors: async (postId: number): Promise<PostAuthor[]> => {
    const { data } = await apiClient.get<ApiResponse<RawPostAuthor[]>>(`/posts/${postId}/authors`);

    return data.data
      .map((author) => normalizePostAuthor(author))
      .filter((author): author is PostAuthor => author !== null);
  },

  searchAuthors: async (query: string): Promise<SearchablePostAuthor[]> => {
    const { data } = await apiClient.get<ApiResponse<RawSearchablePostAuthor[]>>(
      '/posts/authors/search',
      {
        params: { query },
      },
    );

    return data.data
      .map((author) => normalizeSearchablePostAuthor(author))
      .filter((author): author is SearchablePostAuthor => author !== null);
  },

  assignPostAuthor: async (
    postId: number,
    payload: AssignPostAuthorPayload,
  ): Promise<PostAuthor[]> => {
    const { data } = await apiClient.post<ApiResponse<RawPostAuthor[]>>(
      `/posts/${postId}/authors`,
      payload,
    );

    return data.data
      .map((author) => normalizePostAuthor(author))
      .filter((author): author is PostAuthor => author !== null);
  },

  removePostAuthor: async (postId: number, userId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}/authors/${userId}`);
  },
};
