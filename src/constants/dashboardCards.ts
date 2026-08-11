import { ROUTES } from '../app/routes/paths';
import { cardBackgrounds } from '../assets/images';
import type { DashboardCardItem } from '../types/statistics';

export const DASHBOARD_CARDS: DashboardCardItem[] = [
  {
    id: 'foreign-trade',
    labelKey: 'dashboardCards.foreignTrade',
    path: ROUTES.FOREIGN_TRADE,
    background: cardBackgrounds.foreignTrade,
  },
  {
    id: 'logistics-performance',
    labelKey: 'dashboardCards.logisticsPerformance',
    path: ROUTES.RELEASE_TIME,
    background: cardBackgrounds.logisticsPerformance,
  },
  {
    id: 'aqaba-sez',
    labelKey: 'dashboardCards.aqabaSez',
    path: ROUTES.AQABA_SEZ,
    background: cardBackgrounds.aqabaSez,
  },
  {
    id: 'foreign-trade-logistics',
    labelKey: 'dashboardCards.foreignTradeLogistics',
    path: ROUTES.FOREIGN_TRADE_LOGISTICS,
    background: cardBackgrounds.foreignTradeLogistics,
  },
  {
    id: 'statistics',
    labelKey: 'dashboardCards.statistics',
    path: ROUTES.STATISTICS,
    background: cardBackgrounds.statistics,
  },
];
