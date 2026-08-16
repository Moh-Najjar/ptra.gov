export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  departmentId: number | null;
}

export interface UserFormValues {
  fullName: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  departmentId: number | null;
}

export interface UpdateUserPayload {
  fullName: string;
  email: string;
  password?: string;
  role: string;
  isActive: boolean;
  departmentId: number | null;
}

export interface AddUserFormValues {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  website: string;
  language: string;
  password: string;
  sendNotification: boolean;
  role: string;
}

export const createEmptyUserFormValues = (defaultRole = ''): UserFormValues => ({
  fullName: '',
  email: '',
  password: '',
  role: defaultRole,
  isActive: true,
  departmentId: null,
});

export const createEmptyAddUserFormValues = (
  defaultRole = '',
  password = '',
): AddUserFormValues => ({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  website: '',
  language: '',
  password,
  sendNotification: true,
  role: defaultRole,
});

export const mapAdminUserToFormValues = (user: AdminUser): UserFormValues => ({
  fullName: user.fullName,
  email: user.email,
  password: '',
  role: user.role,
  isActive: user.isActive,
  departmentId: user.departmentId,
});

export const isUserFormValid = (values: UserFormValues): boolean =>
  values.fullName.trim().length > 0 &&
  values.email.trim().length > 0 &&
  values.role.trim().length > 0;

export const buildUpdateUserPayload = (formValues: UserFormValues): UpdateUserPayload => {
  const payload: UpdateUserPayload = {
    fullName: formValues.fullName.trim(),
    email: formValues.email.trim(),
    role: formValues.role,
    isActive: formValues.isActive,
    departmentId: formValues.departmentId,
  };

  const trimmedPassword = formValues.password.trim();

  if (trimmedPassword.length > 0) {
    payload.password = trimmedPassword;
  }

  return payload;
};
