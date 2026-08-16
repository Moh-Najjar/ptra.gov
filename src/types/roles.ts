import type { RoutePath } from '../app/routes/paths';
import type { UserRoleKey } from '../constants/userRoles';

export type UserRole = UserRoleKey | string;

export interface AuthenticatedMenuItem {
  path: RoutePath;
  labelKey: string;
}

export interface RoleRouteItem {
  path: RoutePath;
  labelKey: string;
  roles: readonly UserRole[];
}
