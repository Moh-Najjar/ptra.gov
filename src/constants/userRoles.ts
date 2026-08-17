/** Role keys returned by GET /api/Roles — keep in sync with the backend. */
export const USER_ROLES = {
  ADMINISTRATOR: 'administrator',
  AUTHOR: 'author',
  EDITOR: 'editor',
  CONTRIBUTOR: 'contributor',
  SUBSCRIBER: 'subscriber',
} as const;

export type UserRoleKey = (typeof USER_ROLES)[keyof typeof USER_ROLES];