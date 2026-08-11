import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { AppLanguage } from '../i18n/types';
import { getDirection } from '../i18n/types';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const language = i18n.language as AppLanguage;
  const direction = getDirection(language);

  const setLanguage = useCallback(
    (nextLanguage: AppLanguage) => {
      void i18n.changeLanguage(nextLanguage);
    },
    [i18n],
  );

  const toggleLanguage = useCallback(() => {
    const nextLanguage: AppLanguage = language === 'ar' ? 'en' : 'ar';
    void i18n.changeLanguage(nextLanguage);
  }, [i18n, language]);

  const switchLabel =
    language === 'ar' ? t('language.switchToEnglish') : t('language.switchToArabic');

  return {
    language,
    direction,
    setLanguage,
    toggleLanguage,
    switchLabel,
  };
};
