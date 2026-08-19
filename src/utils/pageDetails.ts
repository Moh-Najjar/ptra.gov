import type { AppLanguage } from '../i18n/types';
import {
  PAGE_DETAIL_AUDIT_FIELDS,
  isPageDetailMovementField,
  type PageDetailRecord,
  type PageDetailValue,
} from '../types/pageDetails';
import {
  getDateFieldError,
  getNumberFieldError,
  getRequiredFieldError,
  getTimeFieldError,
  hasValidationErrors,
  type ValidationMessages,
} from './formValidation';

const auditFieldSet = new Set<string>(PAGE_DETAIL_AUDIT_FIELDS);

const preferredRecordLabelFields = [
  'vesselName',
  'stageName',
  'title',
  'name',
  'portName',
] as const;

const isNumericFieldKey = (key: string): boolean => {
  if (/imo/i.test(key) || /Number$/i.test(key)) {
    return false;
  }

  return /(year|sequence|code|count|id)$/i.test(key) || key.endsWith('Sequence');
};

const isNumericTextFieldKey = (key: string): boolean =>
  /imo/i.test(key) || /Number$/i.test(key);

export type PageDetailFieldErrors = Record<string, string | undefined>;

const isDateOnlyValue = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value);

const isTimeOnlyValue = (value: string): boolean => /^\d{2}:\d{2}(:\d{2})?$/.test(value);

const isIsoDateTimeValue = (value: string): boolean => /^\d{4}-\d{2}-\d{2}T/.test(value);

export const normalizePageDetailItem = (item: unknown): PageDetailRecord | null => {
  if (typeof item !== 'object' || item === null) {
    return null;
  }

  const record: PageDetailRecord = {};

  for (const [key, value] of Object.entries(item)) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      record[key] = value;
      continue;
    }

    if (value === undefined) {
      record[key] = null;
      continue;
    }

    record[key] = String(value);
  }

  return record;
};

export const normalizePageDetailItems = (items: unknown[]): PageDetailRecord[] =>
  items
    .map((item) => normalizePageDetailItem(item))
    .filter((item): item is PageDetailRecord => item !== null);

export const extractPageDetailColumnKeys = (items: PageDetailRecord[]): string[] => {
  if (items.length === 0) {
    return [];
  }

  const discoveredKeys = new Set<string>();
  items.forEach((item) => {
    Object.keys(item).forEach((key) => discoveredKeys.add(key));
  });

  const firstItemKeys = Object.keys(items[0]);
  const orderedKeys: string[] = [];

  if (discoveredKeys.has('id')) {
    orderedKeys.push('id');
  }

  firstItemKeys.forEach((key) => {
    if (key !== 'id' && !auditFieldSet.has(key) && !orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });

  discoveredKeys.forEach((key) => {
    if (key !== 'id' && !auditFieldSet.has(key) && !orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });

  PAGE_DETAIL_AUDIT_FIELDS.forEach((key) => {
    if (discoveredKeys.has(key)) {
      orderedKeys.push(key);
    }
  });

  return orderedKeys;
};

export const getEditablePageDetailFieldKeys = (columnKeys: readonly string[]): string[] =>
  columnKeys.filter((key) => key !== 'id' && !auditFieldSet.has(key));

export const createEmptyPageDetailFormValues = (
  fieldKeys: readonly string[],
): Record<string, string> => {
  const values: Record<string, string> = {};

  fieldKeys.forEach((key) => {
    values[key] = '';
  });

  return values;
};

export const mapPageDetailToFormValues = (
  record: PageDetailRecord,
  fieldKeys: readonly string[],
): Record<string, string> => {
  const values = createEmptyPageDetailFormValues(fieldKeys);

  fieldKeys.forEach((key) => {
    const value = record[key];
    values[key] = value === null || value === undefined ? '' : String(value);
  });

  return values;
};

export const humanizePageDetailFieldKey = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (character) => character.toUpperCase())
    .trim();

export const getPageDetailFieldLabel = (
  key: string,
  translate: (translationKey: string) => string,
): string => {
  const translationKey = `pages.pages.details.fields.${key}`;
  const translated = translate(translationKey);
  return translated === translationKey ? humanizePageDetailFieldKey(key) : translated;
};

export const formatPageDetailCellValue = (
  value: PageDetailValue | undefined,
  locale: string,
): string => {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return '—';
  }

  if (isIsoDateTimeValue(trimmedValue)) {
    const parsedDate = new Date(trimmedValue);
    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(parsedDate);
    }
  }

  if (isDateOnlyValue(trimmedValue)) {
    const parsedDate = new Date(`${trimmedValue}T00:00:00`);
    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parsedDate);
    }
  }

  if (isTimeOnlyValue(trimmedValue)) {
    const parsedDate = new Date(`1970-01-01T${trimmedValue}`);
    if (!Number.isNaN(parsedDate.getTime())) {
      return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(parsedDate);
    }
  }

  return trimmedValue;
};

export const getPageDetailRecordLabel = (record: PageDetailRecord): string => {
  for (const key of preferredRecordLabelFields) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  if (typeof record.id === 'number' || typeof record.id === 'string') {
    const titleCandidate = Object.entries(record).find(
      ([key, value]) =>
        key !== 'id' &&
        !auditFieldSet.has(key) &&
        typeof value === 'string' &&
        value.trim().length > 0,
    );

    if (titleCandidate) {
      const [, labelValue] = titleCandidate;
      if (typeof labelValue === 'string') {
        return labelValue;
      }
    }

    return `#${String(record.id)}`;
  }

  const firstStringValue = Object.values(record).find(
    (value) => typeof value === 'string' && value.trim().length > 0,
  );

  return typeof firstStringValue === 'string' ? firstStringValue : '—';
};

export const getPageDetailRecordKey = (record: PageDetailRecord, index: number): string => {
  const { id } = record;
  if (typeof id === 'number' || typeof id === 'string') {
    return String(id);
  }

  return `row-${index}`;
};

export const getPageDetailRecordId = (record: PageDetailRecord): number | null => {
  const { id } = record;

  if (typeof id === 'number' && Number.isFinite(id)) {
    return id;
  }

  if (typeof id === 'string' && /^\d+$/.test(id.trim())) {
    return Number(id.trim());
  }

  return null;
};

export const getPageDetailsTableLocale = (language: AppLanguage): string =>
  language === 'ar' ? 'ar-JO' : 'en-US';

export const getPageDetailInputType = (key: string, value: string): string => {
  if (isDateOnlyValue(value) || key.toLowerCase().includes('date')) {
    return 'date';
  }

  if (isTimeOnlyValue(value) || key.toLowerCase().includes('time')) {
    return 'time';
  }

  if (isNumericFieldKey(key)) {
    return 'number';
  }

  return 'text';
};

export const validatePageDetailFormValues = (
  formValues: Record<string, string>,
  fieldKeys: readonly string[],
  messages: ValidationMessages,
): PageDetailFieldErrors => {
  const errors: PageDetailFieldErrors = {};

  fieldKeys.forEach((key) => {
    const rawValue = formValues[key] ?? '';
    const trimmedValue = rawValue.trim();

    if (isPageDetailMovementField(key)) {
      errors[key] = getRequiredFieldError(trimmedValue, messages);
      return;
    }

    const inputType = getPageDetailInputType(key, trimmedValue);

    if (inputType === 'date') {
      errors[key] = getDateFieldError(trimmedValue, messages);
      return;
    }

    if (inputType === 'time') {
      errors[key] = getTimeFieldError(trimmedValue, messages);
      return;
    }

    if (inputType === 'number' || isNumericTextFieldKey(key)) {
      errors[key] = getNumberFieldError(trimmedValue, messages);
      return;
    }

    errors[key] = getRequiredFieldError(trimmedValue, messages);
  });

  return errors;
};

export const isPageDetailFormValid = (errors: PageDetailFieldErrors): boolean =>
  !hasValidationErrors(errors);

/** Converts form values to API payload — all values are sent as strings. */
export const buildPageDetailPayload = (
  formValues: Record<string, string>,
  fieldKeys: readonly string[],
): PageDetailRecord => {
  const payload: PageDetailRecord = {};

  fieldKeys.forEach((key) => {
    const rawValue = formValues[key]?.trim() ?? '';

    if (rawValue.length > 0) {
      payload[key] = rawValue;
    }
  });

  return payload;
};
