import { useQuery } from '@tanstack/react-query';
import { apmscoBerthingService } from '../../services/apmscoBerthingService';

export const apmscoBerthingKeys = {
  movements: ['apmsco-berthing', 'movements'] as const,
} as const;

export const useApmscoMovementsQuery = (enabled: boolean) =>
  useQuery({
    queryKey: apmscoBerthingKeys.movements,
    queryFn: apmscoBerthingService.getMovements,
    enabled,
    staleTime: 1000 * 60 * 30,
  });
