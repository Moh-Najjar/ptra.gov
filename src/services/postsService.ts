import type { ApiResponse } from '../types/api';
import type { AuthoredPost } from '../types/posts';
import { apiClient } from './api/client';

export const postsService = {
  getAuthoredPosts: async (): Promise<AuthoredPost[]> => {
    const { data } = await apiClient.get<ApiResponse<AuthoredPost[]>>('/posts/me/authored');
    return data.data;
  },
};
