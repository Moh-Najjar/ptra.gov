/** Role keys returned by GET /api/Roles — keep in sync with the backend. */
export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  EDITOR: 'editor',
  AUTHOR: 'author',
  CONTRIBUTOR: 'contributor',
  SUBSCRIBER: 'subscriber',
} as const;

export type UserRoleKey = (typeof USER_ROLES)[keyof typeof USER_ROLES];