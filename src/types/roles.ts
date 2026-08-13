import type { RoutePath } from '../app/routes/paths';

/** Role keys returned by the auth API. */
export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  EDITOR: 'editor',
  AUTHOR: 'author',
  CONTRIBUTOR: 'contributor',
  SUBSCRIBER: 'subscriber',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface AuthenticatedMenuItem {
  path: RoutePath;
  labelKey: string;
}

export interface RoleRouteItem {
  path: RoutePath;
  labelKey: string;
  roles: readonly UserRole[];
}
