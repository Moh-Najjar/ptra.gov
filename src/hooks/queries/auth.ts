import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type { AuthSession, LoginCredentials } from '../../types/auth';

export const authKeys = {
  session: ['auth', 'session'] as const,
} as const;

export const useAuthSessionQuery = () =>
  useQuery<AuthSession | null>({
    queryKey: authKeys.session,
    queryFn: authService.getStoredSession,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

export const useLoginMutation = () => {
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

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session, null);
    },
  });
};
