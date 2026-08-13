import { ROUTES } from '../app/routes/paths';
import { USER_ROLES, type RoleRouteItem } from '../types/roles';

/** Protected routes shown in the user menu, filtered by the signed-in user's roles. */
export const ROLE_ROUTES: readonly RoleRouteItem[] = [
  {
    path: ROUTES.POST,
    labelKey: 'nav.post',
    roles: [USER_ROLES.ADMINISTRATOR],
  },
  {
    path: ROUTES.PAGES,
    labelKey: 'nav.pages',
    roles: [USER_ROLES.ADMINISTRATOR],
  },
  {
    path: ROUTES.USERS,
    labelKey: 'nav.users',
    roles: [USER_ROLES.ADMINISTRATOR],
  },
];
