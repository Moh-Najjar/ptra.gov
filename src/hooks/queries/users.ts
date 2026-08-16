import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../services/usersService';
import type { CreateUserPayload, UpdateUserPayload } from '../../types/user';

export const usersKeys = {
  list: ['users', 'list'] as const,
} as const;

interface UpdateUserVariables {
  userId: string;
  payload: UpdateUserPayload;
}

export const useUsersQuery = (enabled: boolean) =>
  useQuery({
    queryKey: usersKeys.list,
    queryFn: usersService.getUsers,
    enabled,
  });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateUserVariables) =>
      usersService.updateUser(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.list });
    },
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.createUser(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.list });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.deleteUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.list });
    },
  });
};
