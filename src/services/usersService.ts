import type { ApiResponse } from '../types/api';
import type { AdminUser } from '../types/user';
import { apiClient } from './api/client';

const normalizeUsersResponse = (data: AdminUser[] | ApiResponse<AdminUser[]>): AdminUser[] => {
  if (Array.isArray(data)) {
    return data;
  }

  return data.data;
};

export const usersService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await apiClient.get<AdminUser[] | ApiResponse<AdminUser[]>>('/Users');
    return normalizeUsersResponse(data);
  },
};
