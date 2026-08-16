import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../services/usersService';
import type { UpdateUserPayload } from '../../types/user';
import { usersKeys } from './usersKeys';

interface UpdateUserVariables {
  userId: string;
  payload: UpdateUserPayload;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: UpdateUserVariables) =>
      usersService.updateUser(userId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.list });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.deleteUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.list });
    },
  });
};
