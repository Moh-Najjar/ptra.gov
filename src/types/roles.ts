import type { RoutePath } from '../app/routes/paths';

/** Role key required for administrator-only routes and guards. */
export const ADMINISTRATOR_ROLE = 'administrator' as const;

export type UserRole = string;

export interface AuthenticatedMenuItem {
  path: RoutePath;
  labelKey: string;
}

export interface RoleRouteItem {
  path: RoutePath;
  labelKey: string;
  roles: readonly UserRole[];
}
