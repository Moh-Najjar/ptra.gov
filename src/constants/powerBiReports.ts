import { ROUTES } from '../app/routes/paths';
import type { PowerBiReportConfig, PowerBiReportId } from '../types/powerBi';

const POWER_BI_VIEW_HOST = 'app.powerbi.com';

/** Validates that a URL is a Power BI public view link before embedding. */
const assertPowerBiViewUrl = (url: string): string => {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(`Invalid Power BI embed URL: ${url}`);
  }

  if (parsedUrl.hostname !== POWER_BI_VIEW_HOST || !parsedUrl.pathname.startsWith('/view')) {
    throw new Error(`URL must be a Power BI view link on ${POWER_BI_VIEW_HOST}: ${url}`);
  }

  return url;
};

/**
 * Single source of truth for all Power BI report pages.
 * Add or update reports here — page components read from this config.
 */
export const POWER_BI_REPORTS: Record<PowerBiReportId, PowerBiReportConfig> = {
  crops: {
    id: 'crops',
    titleKey: 'pages.crops.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiY2UzYWI3NGUtNGM1My00NjliLTk3ZGYtYTVlZTdlNDRjMWUyIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.CROPS,
  },
  exports: {
    id: 'exports',
    titleKey: 'pages.exports.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiYmQ2ZTJkZDctNzVmMC00ZmViLWEwNWYtZDIzMGRlMzQ4MmEzIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.FOREIGN_TRADE_EXPORTS,
  },
  imports: {
    id: 'imports',
    titleKey: 'pages.imports.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiMTBiZThiNGMtZmY5OC00MTg2LWJkZjEtZmE2YTFmOGJmMTkxIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.FOREIGN_TRADE_IMPORTS,
  },
  transit: {
    id: 'transit',
    titleKey: 'pages.transit.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiMGEwN2ZmZDgtYTAxZi00ZTA3LTgwMzEtOTYwNjQ1OTVmNWRjIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.FOREIGN_TRADE_TRANSIT,
  },
  tradeBalance: {
    id: 'tradeBalance',
    titleKey: 'pages.tradeBalance.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiY2JiNTQzMjctYWM1ZC00YWYzLTg2ODEtZjRhNDUwZGZkZjQyIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.FOREIGN_TRADE_BALANCE,
  },
  releaseTime: {
    id: 'releaseTime',
    titleKey: 'pages.releaseTime.title',
    descriptionKey: 'pages.releaseTime.description',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiYTkwMDE5ZDUtMWMyNy00N2U3LTkyMWEtZDU5ODE2NzYxYjNmIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.RELEASE_TIME,
  },
  containerDwellTime: {
    id: 'containerDwellTime',
    titleKey: 'pages.containerDwellTime.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiMmE4YThkNWUtOTA5OS00MGRmLTk2OTctZWEwNzNhOTRiNzM1IiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.CONTAINER_DWELL_TIME,
  },
  aqabaSez: {
    id: 'aqabaSez',
    titleKey: 'pages.aqabaSez.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiYjU3MzE0NDYtMmZjNi00MmY4LThjOGItNjA5MjhhNjRjOGYyIiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.AQABA_SEZ,
  },
  containerFlowStatistics: {
    id: 'containerFlowStatistics',
    titleKey: 'pages.containerFlowStatistics.title',
    embedUrl: assertPowerBiViewUrl(
      'https://app.powerbi.com/view?r=eyJrIjoiZDVkOTFlMDItNzEyMS00ODIwLThmMjYtNjU5MTE5YmI5MDQ0IiwidCI6IjhiMjk0MDVjLTZkMDEtNGRmMy1iNTY5LWM0NmY1NjI0YmY2ZSIsImMiOjl9',
    ),
    route: ROUTES.CONTAINER_FLOW_STATISTICS,
  },
};

/** Returns report config by id; throws if the id is unknown. */
export const getPowerBiReport = (reportId: PowerBiReportId): PowerBiReportConfig => {
  const report = POWER_BI_REPORTS[reportId];

  if (!report) {
    throw new Error(`Unknown Power BI report id: ${reportId}`);
  }

  return report;
};
