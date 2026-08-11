export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type TextDirection = 'rtl' | 'ltr';

export const LANGUAGE_STORAGE_KEY = 'ptra_language';

export const DEFAULT_LANGUAGE: AppLanguage = 'ar';

export const getDirection = (language: AppLanguage): TextDirection =>
  language === 'ar' ? 'rtl' : 'ltr';

export const isAppLanguage = (value: string): value is AppLanguage =>
  SUPPORTED_LANGUAGES.includes(value as AppLanguage);

export const getStoredLanguage = (): AppLanguage => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && isAppLanguage(stored)) {
    return stored;
  }
  return DEFAULT_LANGUAGE;
};

export const applyDocumentLanguage = (language: AppLanguage): void => {
  const direction = getDirection(language);
  document.documentElement.lang = language;
  document.documentElement.dir = direction;
};
