import { statBackgrounds } from '../assets/images';
import type { StatisticItem } from '../types/statistics';

export const GENERAL_STATISTICS: StatisticItem[] = [
  {
    id: 'imports',
    value: '2',
    labelKey: 'stats.imports',
    background: statBackgrounds.imports,
  },
  {
    id: 'exports',
    value: '1',
    labelKey: 'stats.exports',
    background: statBackgrounds.exports,
  },
  {
    id: 'trade-balance',
    value: '-2',
    labelKey: 'stats.tradeBalance',
    background: statBackgrounds.tradeBalance,
  },
  {
    id: 'containers',
    value: '62628',
    labelKey: 'stats.containers',
    background: statBackgrounds.containers,
  },
  {
    id: 'car-movements',
    value: '152665',
    labelKey: 'stats.carMovements',
    background: statBackgrounds.carMovements,
  },
  {
    id: 'truck-movements',
    value: '226454',
    labelKey: 'stats.truckMovements',
    background: statBackgrounds.truckMovements,
  },
];

export const VISITOR_COUNT = '5474536';
