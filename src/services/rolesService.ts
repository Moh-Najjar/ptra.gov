import type { ApiResponse } from '../types/api';
import type { AppRole } from '../types/role';
import { apiClient } from './api/client';

interface RawAppRole {
  key?: string;
  Key?: string;
  name?: string;
  Name?: string;
}

const normalizeRole = (role: RawAppRole): AppRole | null => {
  const key = role.key ?? role.Key;
  const name = role.name ?? role.Name;

  if (typeof key !== 'string' || key.trim().length === 0) {
    return null;
  }

  const trimmedKey = key.trim();

  if (typeof name !== 'string' || name.trim().length === 0) {
    return { key: trimmedKey, name: trimmedKey };
  }

  return { key: trimmedKey, name: name.trim() };
};

export const rolesService = {
  getRoles: async (): Promise<AppRole[]> => {
    const { data } = await apiClient.get<ApiResponse<RawAppRole[]>>('/Roles');

    return data.data
      .map(normalizeRole)
      .filter((role): role is AppRole => role !== null);
  },
};
