import type { TFunction } from 'i18next';
import type { ValidationMessages } from './formValidation';

export const getValidationMessages = (t: TFunction): ValidationMessages => ({
  required: t('common.validation.required'),
  invalidEmail: t('common.validation.invalidEmail'),
  invalidNumber: t('common.validation.invalidNumber'),
  invalidUrl: t('common.validation.invalidUrl'),
  invalidDate: t('common.validation.invalidDate'),
  invalidTime: t('common.validation.invalidTime'),
  invalidImoNumber: t('common.validation.invalidImoNumber'),
});
