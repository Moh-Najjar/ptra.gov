import { statBackgrounds } from '../assets/images';
import type { AppLanguage } from '../i18n/types';
import type { GeneralCounterItem, TranslatedStatisticItem } from '../types/statistics';
import { formatSystemNumber } from './formatNumber';

const BILLION_COUNTER_CODES = new Set<string>(['Imports', 'Exports', 'Trade']);

const STAT_BACKGROUND_BY_CODE: Record<string, string> = {
  Imports: statBackgrounds.imports,
  Exports: statBackgrounds.exports,
  Trade: statBackgrounds.tradeBalance,
  Containers: statBackgrounds.containers,
  Cars: statBackgrounds.carMovements,
  Trucks: statBackgrounds.truckMovements,
};

export const getStatBackgroundByCode = (code: string): string => {
  const background = STAT_BACKGROUND_BY_CODE[code];
  return background ?? statBackgrounds.imports;
};

/** Fraction digits for billion-scale counters vs whole-number counters. */
export const getGeneralCounterFractionDigits = (code: string): number =>
  BILLION_COUNTER_CODES.has(code) ? 2 : 0;

export const formatGeneralCounterValue = (value: number, code: string): string => {
  const fractionDigits = getGeneralCounterFractionDigits(code);

  return formatSystemNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
};

export const getGeneralCounterTitle = (
  titleAr: string,
  titleEn: string,
  language: AppLanguage,
): string => (language === 'ar' ? titleAr : titleEn);

export const mapGeneralCountersToDisplayItems = (
  counters: GeneralCounterItem[],
  language: AppLanguage,
): TranslatedStatisticItem[] =>
  counters.map((counter) => ({
    id: counter.id,
    numericValue: counter.value,
    fractionDigits: getGeneralCounterFractionDigits(counter.code),
    value: formatGeneralCounterValue(counter.value, counter.code),
    background: getStatBackgroundByCode(counter.code),
    label: getGeneralCounterTitle(counter.titleAr, counter.titleEn, language),
  }));
