import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import type { AuthSession } from '../../types/auth';
import { authKeys } from './authKeys';

export const useAuthSession = () => {
  return useQuery<AuthSession | null>({
    queryKey: authKeys.session,
    queryFn: authService.getStoredSession,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
};
