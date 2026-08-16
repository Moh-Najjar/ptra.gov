import type { AppLanguage } from '../i18n/types';

export const getPagesTableLocale = (language: AppLanguage): string =>
  language === 'ar' ? 'ar-JO' : 'en-US';
