export const ROUTES = {
  HOME: '/',
  CROPS: '/crops',
  FOREIGN_TRADE: '/foreign-trade',
  FOREIGN_TRADE_EXPORTS: '/foreign-trade/exports',
  FOREIGN_TRADE_IMPORTS: '/foreign-trade/imports',
  FOREIGN_TRADE_TRANSIT: '/foreign-trade/transit',
  FOREIGN_TRADE_BALANCE: '/foreign-trade/trade-balance',
  LOGISTICS_PERFORMANCE: '/logistics-performance',
  RELEASE_TIME: '/logistics-performance/release-time',
  CONTAINER_DWELL_TIME: '/logistics-performance/container-dwell-time',
  AQABA_SEZ: '/aqaba-sez',
  FOREIGN_TRADE_LOGISTICS: '/foreign-trade-logistics',
  CONTAINER_FLOW_STATISTICS: '/foreign-trade-logistics/container-flow-statistics',
  STATISTICS: '/statistics',
  FAQ: '/faq',
  ABOUT: '/about',
  CONTACT: '/contact',
  ACCESSIBILITY: '/accessibility',
  PRIVACY: '/privacy',
  OPERATION: '/operation',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
