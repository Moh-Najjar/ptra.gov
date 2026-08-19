export interface ValidationMessages {
  required: string;
  invalidEmail: string;
  invalidNumber: string;
  invalidUrl: string;
  invalidDate: string;
  invalidTime: string;
}

export const isNonEmptyTrimmed = (value: string): boolean => value.trim().length > 0;

export const isValidEmail = (value: string): boolean => {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
};

export const isValidNumberString = (value: string): boolean => {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return false;
  }

  const parsedNumber = Number(trimmedValue);
  return Number.isFinite(parsedNumber);
};

export const isValidUrl = (value: string): boolean => {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return false;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidDateString = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value.trim());

export const isValidTimeString = (value: string): boolean =>
  /^\d{2}:\d{2}(:\d{2})?$/.test(value.trim());

export const hasValidationErrors = (errors: Record<string, string | undefined>): boolean =>
  Object.values(errors).some((error) => typeof error === 'string' && error.length > 0);

export const getRequiredFieldError = (
  value: string,
  messages: ValidationMessages,
): string | undefined => (isNonEmptyTrimmed(value) ? undefined : messages.required);

export const getEmailFieldError = (
  value: string,
  messages: ValidationMessages,
): string | undefined => {
  if (!isNonEmptyTrimmed(value)) {
    return messages.required;
  }

  return isValidEmail(value) ? undefined : messages.invalidEmail;
};

export const getNumberFieldError = (
  value: string,
  messages: ValidationMessages,
): string | undefined => {
  if (!isNonEmptyTrimmed(value)) {
    return messages.required;
  }

  return isValidNumberString(value) ? undefined : messages.invalidNumber;
};

export const getUrlFieldError = (
  value: string,
  messages: ValidationMessages,
): string | undefined => {
  if (!isNonEmptyTrimmed(value)) {
    return messages.required;
  }

  return isValidUrl(value) ? undefined : messages.invalidUrl;
};

export const getDateFieldError = (
  value: string,
  messages: ValidationMessages,
): string | undefined => {
  if (!isNonEmptyTrimmed(value)) {
    return messages.required;
  }

  return isValidDateString(value) ? undefined : messages.invalidDate;
};

export const getTimeFieldError = (
  value: string,
  messages: ValidationMessages,
): string | undefined => {
  if (!isNonEmptyTrimmed(value)) {
    return messages.required;
  }

  return isValidTimeString(value) ? undefined : messages.invalidTime;
};
