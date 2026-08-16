import type { AppRole } from '../types/role';

export const ADMINISTRATOR_ROLE_KEY = 'administrator';

export const isAdministratorRole = (roleKey: string): boolean =>
  roleKey.trim().toLowerCase() === ADMINISTRATOR_ROLE_KEY;

export const getDefaultAddUserRoleKey = (roles: readonly AppRole[]): string => {
  const subscriberRole = roles.find((role) => role.key.toLowerCase() === 'subscriber');
  if (subscriberRole) {
    return subscriberRole.key;
  }

  return getDefaultRoleKey(roles);
};

export const getDefaultRoleKey = (roles: readonly AppRole[]): string => {
  const authorRole = roles.find((role) => role.key.toLowerCase() === 'author');
  if (authorRole) {
    return authorRole.key;
  }

  return roles[0]?.key ?? '';
};

export const getRoleDisplayName = (
  roleKey: string,
  roles: readonly AppRole[],
  translate?: (translationKey: string) => string,
): string => {
  const normalizedKey = roleKey.trim().toLowerCase();
  const matchedRole = roles.find((role) => role.key.toLowerCase() === normalizedKey);

  if (matchedRole) {
    return matchedRole.name;
  }

  if (translate) {
    const translationKey = `pages.users.roles.${normalizedKey}`;
    const translated = translate(translationKey);

    if (translated !== translationKey) {
      return translated;
    }
  }

  return roleKey;
};
