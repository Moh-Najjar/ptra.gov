import { useAuthSessionQuery } from './queries/auth';

/** Reads the cached auth session via TanStack Query. */
export const useAuthSession = () => useAuthSessionQuery();
