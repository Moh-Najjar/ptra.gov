import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authKeys } from './authKeys';
import { authService } from '../../services/authService';
import type { AuthSession, LoginCredentials } from '../../types/auth';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthSession, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const session = await authService.login(credentials);
      return authService.persistSession(session);
    },
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session, session);
    },
  });
};
