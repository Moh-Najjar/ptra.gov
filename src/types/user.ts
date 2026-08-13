export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface UserFormValues {
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

export const createEmptyUserFormValues = (): UserFormValues => ({
  fullName: '',
  email: '',
  role: 'author',
  isActive: true,
});

export const mapAdminUserToFormValues = (user: AdminUser): UserFormValues => ({
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
});
