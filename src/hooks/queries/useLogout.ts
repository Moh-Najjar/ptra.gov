import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from './authKeys';
import { authService } from '../../services/authService';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, null);
    },
  });
};
