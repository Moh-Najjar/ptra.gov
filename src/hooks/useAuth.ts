import {
  useAuthSessionQuery,
  useLoginMutation,
  useLogoutMutation,
} from './queries/auth';

export const useAuth = () => {
  const sessionQuery = useAuthSessionQuery();
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();

  const session = sessionQuery.data ?? null;

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: session !== null,
    isLoading: sessionQuery.isLoading,
    login: loginMutation.mutateAsync,
    loginMutation,
    logout: logoutMutation.mutateAsync,
    logoutMutation,
  };
};
