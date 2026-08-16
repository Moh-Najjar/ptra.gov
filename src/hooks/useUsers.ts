import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUsersQuery,
} from './queries/users';
import { useAuth } from './useAuth';

export const useUsers = () => {
  const { isAuthenticated } = useAuth();
  return useUsersQuery(isAuthenticated);
};

export const useUpdateUser = () => useUpdateUserMutation();

export const useDeleteUser = () => useDeleteUserMutation();
