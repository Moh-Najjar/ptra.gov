import { ROUTES } from '../app/routes/paths';
import { ADMINISTRATOR_ROLE, type RoleRouteItem } from '../types/roles';

/** Protected routes shown in the user menu, filtered by the signed-in user's roles. */
export const ROLE_ROUTES: readonly RoleRouteItem[] = [
  {
    path: ROUTES.POST,
    labelKey: 'nav.post',
    roles: [ADMINISTRATOR_ROLE],
  },
  {
    path: ROUTES.PAGES,
    labelKey: 'nav.pages',
    roles: [ADMINISTRATOR_ROLE],
  },
  {
    path: ROUTES.USERS,
    labelKey: 'nav.users',
    roles: [ADMINISTRATOR_ROLE],
  },
];
