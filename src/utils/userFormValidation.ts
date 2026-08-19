import type { AddUserFormValues, UserFormValues } from '../types/user';
import {
  getEmailFieldError,
  getRequiredFieldError,
  getUrlFieldError,
  hasValidationErrors,
  type ValidationMessages,
} from './formValidation';

export type AddUserFieldErrors = Partial<Record<keyof AddUserFormValues, string>>;
export type EditUserFieldErrors = Partial<Record<keyof UserFormValues, string>>;

export const validateAddUserForm = (
  values: AddUserFormValues,
  messages: ValidationMessages,
): AddUserFieldErrors => {
  const errors: AddUserFieldErrors = {
    username: getRequiredFieldError(values.username, messages),
    email: getEmailFieldError(values.email, messages),
    firstName: getRequiredFieldError(values.firstName, messages),
    lastName: getRequiredFieldError(values.lastName, messages),
    website: getUrlFieldError(values.website, messages),
    password: getRequiredFieldError(values.password, messages),
    role: getRequiredFieldError(values.role, messages),
  };

  return errors;
};

export const isAddUserFormValidWithErrors = (errors: AddUserFieldErrors): boolean =>
  !hasValidationErrors(errors);

export const validateEditUserForm = (
  values: UserFormValues,
  messages: ValidationMessages,
): EditUserFieldErrors => {
  const errors: EditUserFieldErrors = {
    fullName: getRequiredFieldError(values.fullName, messages),
    email: getEmailFieldError(values.email, messages),
    role: getRequiredFieldError(values.role, messages),
  };

  return errors;
};

export const isEditUserFormValidWithErrors = (errors: EditUserFieldErrors): boolean =>
  !hasValidationErrors(errors);
