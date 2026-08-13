import { ROUTES } from '../app/routes/paths';
import { ROLE_ROUTES } from '../constants/roleRoutes';
import type { AuthUser } from '../types/auth';
import type { RoleRouteItem, UserRole } from '../types/roles';

const normalizeRoleKey = (role: string): string => role.trim().toLowerCase();

/** Returns true when the user has at least one of the required roles. */
export const userHasAnyRole = (
  user: AuthUser | null,
  requiredRoles: readonly UserRole[],
): boolean => {
  if (!user || requiredRoles.length === 0) {
    return false;
  }

  const userRoles = new Set(user.roles.map(normalizeRoleKey));
  return requiredRoles.some((role) => userRoles.has(normalizeRoleKey(role)));
};

/** Role-based menu and route entries visible to the current user. */
export const getAccessibleRoutes = (user: AuthUser | null): RoleRouteItem[] => {
  if (!user) {
    return [];
  }

  return ROLE_ROUTES.filter((route) => userHasAnyRole(user, route.roles));
};

/** Default landing page after login. */
export const getDefaultAuthenticatedRoute = (): typeof ROUTES.MY_ACCOUNT => ROUTES.MY_ACCOUNT;

export const getUserDisplayName = (user: AuthUser): string => {
  if (user.fullName.trim().length > 0) {
    return user.fullName.trim();
  }

  if (user.displayName.trim().length > 0) {
    return user.displayName.trim();
  }

  return user.username;
};

export const getUserInitials = (user: AuthUser): string => {
  const displayName = getUserDisplayName(user);
  const parts = displayName.split(/\s+/).filter((part) => part.length > 0);

  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
};
