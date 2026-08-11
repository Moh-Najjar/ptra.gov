import { useAuthSession } from './queries/useAuthSession';
import { useLogin } from './queries/useLogin';
import { useLogout } from './queries/useLogout';

export const useAuth = () => {
  const sessionQuery = useAuthSession();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

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
