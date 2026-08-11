import type { RoutePath } from '../app/routes/paths';

/** Unique identifier for each Power BI report embedded in the portal. */
export type PowerBiReportId =
  | 'crops' // الحاصلات
  | 'exports' // الصادرات
  | 'imports' // المستوردات
  | 'transit' // ترانزيت
  | 'tradeBalance' // ميزان تجاري
  | 'releaseTime' // زمن الإفراج
  | 'containerDwellTime' // زمن مكوث الحاويات
  | 'aqabaSez' // منطقة العقبة الاقتصادية الخاصة
  | 'containerFlowStatistics' // إحصائيات تدفق الحاويات

/** Metadata required to render a Power BI report page. */
export interface PowerBiReportConfig {
  /** Stable id used by page components and lookups. */
  id: PowerBiReportId;
  /** i18n key for the page title (e.g. pages.exports.title). */
  titleKey: string;
  /** Public Power BI embed URL (view link). */
  embedUrl: string;
  /** App route path this report is mounted on. */
  route: RoutePath;
  /** Optional i18n key for a page description shown above the report. */
  descriptionKey?: string;
}
