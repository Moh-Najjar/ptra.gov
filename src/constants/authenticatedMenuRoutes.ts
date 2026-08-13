import { ROUTES } from '../app/routes/paths';
import type { AuthenticatedMenuItem } from '../types/roles';

/** Routes visible to every authenticated user (no role required). */
export const AUTHENTICATED_MENU_ROUTES: readonly AuthenticatedMenuItem[] = [
  {
    path: ROUTES.MY_ACCOUNT,
    labelKey: 'nav.myAccount',
  },
];
