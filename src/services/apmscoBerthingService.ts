import type { ApiResponse } from '../types/api';
import type { ApmscoMovementOption } from '../types/apmscoBerthing';
import { apiClient } from './api/client';

interface RawApmscoMovementOption {
  value?: string;
  Value?: string;
  labelEn?: string;
  LabelEn?: string;
  labelAr?: string;
  LabelAr?: string;
}

const normalizeMovementOption = (
  option: RawApmscoMovementOption,
): ApmscoMovementOption | null => {
  const value = option.value ?? option.Value;
  const labelEn = option.labelEn ?? option.LabelEn;
  const labelAr = option.labelAr ?? option.LabelAr;

  if (
    typeof value !== 'string' ||
    typeof labelEn !== 'string' ||
    typeof labelAr !== 'string'
  ) {
    return null;
  }

  return { value, labelEn, labelAr };
};

export const apmscoBerthingService = {
  getMovements: async (): Promise<ApmscoMovementOption[]> => {
    const { data } = await apiClient.get<ApiResponse<RawApmscoMovementOption[]>>(
      '/apmsco-berthing/movements',
    );

    return data.data
      .map((option) => normalizeMovementOption(option))
      .filter((option): option is ApmscoMovementOption => option !== null);
  },
};
