import { ROUTES } from '../app/routes/paths';
import { cardBackgrounds } from '../assets/images';
import type { DashboardCardItem } from '../types/statistics';

export const DASHBOARD_CARDS: DashboardCardItem[] = [
  {
    id: 'foreign-trade',
    labelKey: 'dashboardCards.foreignTrade',
    descriptionKey: 'dashboardCards.foreignTradeDescription',
    path: ROUTES.FOREIGN_TRADE_EXPORTS,
    background: cardBackgrounds.foreignTrade,
  },
  {
    id: 'logistics-performance',
    labelKey: 'dashboardCards.logisticsPerformance',
    descriptionKey: 'dashboardCards.logisticsPerformanceDescription',
    path: ROUTES.RELEASE_TIME,
    background: cardBackgrounds.logisticsPerformance,
  },
  {
    id: 'aqaba-sez',
    labelKey: 'dashboardCards.aqabaSez',
    descriptionKey: 'dashboardCards.aqabaSezDescription',
    path: ROUTES.AQABA_SEZ,
    background: cardBackgrounds.aqabaSez,
  },
  {
    id: 'foreign-trade-logistics',
    labelKey: 'dashboardCards.foreignTradeLogistics',
    descriptionKey: 'dashboardCards.foreignTradeLogisticsDescription',
    path: ROUTES.FOREIGN_TRADE_LOGISTICS,
    background: cardBackgrounds.foreignTradeLogistics,
  },
  {
    id: 'crops',
    labelKey: 'dashboardCards.crops',
    descriptionKey: 'dashboardCards.cropsDescription',
    path: ROUTES.CROPS,
    background: cardBackgrounds.crops,
  },
];
