import { statBackgrounds } from '../assets/images';
import type { AppLanguage } from '../i18n/types';
import type { GeneralCounterItem, TranslatedStatisticItem } from '../types/statistics';

const BILLION_COUNTER_CODES = new Set<string>(['Imports', 'Exports', 'Trade']);

const STAT_BACKGROUND_BY_CODE: Record<string, string> = {
  Imports: statBackgrounds.imports,
  Exports: statBackgrounds.exports,
  Trade: statBackgrounds.tradeBalance,
  Containers: statBackgrounds.containers,
  Cars: statBackgrounds.carMovements,
  Trucks: statBackgrounds.truckMovements,
};

export const getGeneralStatsLocale = (language: AppLanguage): string =>
  language === 'ar' ? 'ar-JO' : 'en-US';

export const getStatBackgroundByCode = (code: string): string => {
  const background = STAT_BACKGROUND_BY_CODE[code];
  return background ?? statBackgrounds.imports;
};

export const formatGeneralCounterValue = (
  value: number,
  code: string,
  locale: string,
): string => {
  if (BILLION_COUNTER_CODES.has(code)) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
};

export const getGeneralCounterTitle = (
  titleAr: string,
  titleEn: string,
  language: AppLanguage,
): string => (language === 'ar' ? titleAr : titleEn);

export const mapGeneralCountersToDisplayItems = (
  counters: GeneralCounterItem[],
  language: AppLanguage,
): TranslatedStatisticItem[] => {
  const locale = getGeneralStatsLocale(language);

  return counters.map((counter) => ({
    id: counter.id,
    value: formatGeneralCounterValue(counter.value, counter.code, locale),
    background: getStatBackgroundByCode(counter.code),
    label: getGeneralCounterTitle(counter.titleAr, counter.titleEn, language),
  }));
};
