import type { ApiResponse } from '../types/api';
import type { AdminUser, CreateUserPayload, UpdateUserPayload } from '../types/user';
import { apiClient } from './api/client';

interface RawAdminUser {
  id?: string | number;
  Id?: string;
  userId?: string;
  UserId?: string;
  fullName?: string;
  FullName?: string;
  email?: string;
  Email?: string;
  role?: string;
  Role?: string;
  isActive?: boolean;
  IsActive?: boolean;
  departmentId?: number | null;
  DepartmentId?: number | null;
}

const normalizeAdminUser = (user: RawAdminUser): AdminUser | null => {
  const rawId = user.id ?? user.Id ?? user.userId ?? user.UserId;

  if (rawId === undefined || rawId === null || String(rawId).trim().length === 0) {
    return null;
  }

  const fullName = user.fullName ?? user.FullName;
  const email = user.email ?? user.Email;
  const role = user.role ?? user.Role;

  if (
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof role !== 'string'
  ) {
    return null;
  }

  return {
    id: String(rawId),
    fullName,
    email,
    role,
    isActive: user.isActive ?? user.IsActive ?? true,
    departmentId: user.departmentId ?? user.DepartmentId ?? null,
  };
};

const normalizeUsersResponse = (data: RawAdminUser[] | ApiResponse<RawAdminUser[]>): AdminUser[] => {
  const rawUsers = Array.isArray(data) ? data : data.data;

  return rawUsers
    .map((user) => normalizeAdminUser(user))
    .filter((user): user is AdminUser => user !== null);
};

export const usersService = {
  getUsers: async (): Promise<AdminUser[]> => {
    const { data } = await apiClient.get<RawAdminUser[] | ApiResponse<RawAdminUser[]>>('/Users');
    return normalizeUsersResponse(data);
  },

  createUser: async (payload: CreateUserPayload): Promise<void> => {
    await apiClient.post<ApiResponse<unknown>>('/users', payload);
  },

  updateUser: async (userId: string, payload: UpdateUserPayload): Promise<void> => {
    await apiClient.put<ApiResponse<unknown>>(`/users/internal/${userId}`, payload);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete<ApiResponse<unknown>>(`/users/internal/${userId}`);
  },
};
