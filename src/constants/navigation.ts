import { ROUTES } from '../app/routes/paths';
import type { NavItem, UtilityLink } from '../types/navigation';

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', path: ROUTES.HOME },
  { labelKey: 'nav.crops', path: ROUTES.CROPS },
  {
    labelKey: 'nav.foreignTrade',
    path: ROUTES.FOREIGN_TRADE,
    children: [
      { labelKey: 'nav.exports', path: ROUTES.FOREIGN_TRADE_EXPORTS },
      { labelKey: 'nav.imports', path: ROUTES.FOREIGN_TRADE_IMPORTS },
      { labelKey: 'nav.transit', path: ROUTES.FOREIGN_TRADE_TRANSIT },
      { labelKey: 'nav.tradeBalance', path: ROUTES.FOREIGN_TRADE_BALANCE },
    ],
  },
  {
    labelKey: 'nav.logisticsPerformance',
    path: ROUTES.RELEASE_TIME,
    children: [
      { labelKey: 'nav.releaseTime', path: ROUTES.RELEASE_TIME },
      { labelKey: 'nav.containerDwellTime', path: ROUTES.CONTAINER_DWELL_TIME },
    ],
  },
  { labelKey: 'nav.aqabaSez', path: ROUTES.AQABA_SEZ },
  {
    labelKey: 'nav.foreignTradeLogistics',
    path: ROUTES.FOREIGN_TRADE_LOGISTICS,
    children: [
      { labelKey: 'nav.containerFlowStatistics', path: ROUTES.CONTAINER_FLOW_STATISTICS },
    ],
  },
];

export const UTILITY_LINKS: UtilityLink[] = [
  { labelKey: 'utility.faq', path: ROUTES.FAQ },
  { labelKey: 'utility.about', path: ROUTES.ABOUT },
  { labelKey: 'utility.contact', path: ROUTES.CONTACT },
];
