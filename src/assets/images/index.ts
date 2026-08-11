import heroSlide10 from './hero/slide-10.png';
import heroSlide11 from './hero/slide-11.png';
import heroSlide12 from './hero/slide-12.png';
import heroSlide13 from './hero/slide-13.png';

import foreignTradeCardImage from './cards/foreignTrade.png';
import logisticsPerformanceCardImage from './cards/logisticsPerformance.png';
import aqabaSezCardImage from './cards/aqabaSez.jpg';
import foreignTradeLogisticsCardImage from './cards/foreignTradeLogistics.png';
import statisticsCardImage from './cards/statistics.png';
import executionLogo1 from './PartnerLogos/Execution-1.png';
import executionLogo2 from './PartnerLogos/Execution-2.png';
import partnershipLogo1 from './PartnerLogos/Partnership-1.png';
import partnershipLogo2 from './PartnerLogos/Partnership-2.png';
import partnershipLogo3 from './PartnerLogos/Partnership-3.png';
import fundedLogo1 from './PartnerLogos/Funded-1.png';
import fundedLogo2 from './PartnerLogos/Funded-2.png';

const createGradient = (from: string, to: string): string =>
  `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

export const heroBackground = createGradient('#7EC0E8', '#3589C5');

export const heroSlideBackgrounds = {
  slide1: `linear-gradient(rgb(111 178 208 / 50%), rgb(111 178 208 / 50%)), url(${heroSlide10})`,
  slide2: `linear-gradient(rgba(27, 117, 188, 0.42), rgba(14, 90, 150, 0.55)), url(${heroSlide11})`,
  slide3: `linear-gradient(rgba(27, 79, 114, 0.48), rgba(14, 90, 150, 0.58)), url(${heroSlide12})`,
  slide4: `linear-gradient(rgba(36, 113, 163, 0.45), rgba(14, 90, 150, 0.56)), url(${heroSlide13})`,
} as const;

export const cardBackgrounds = {
  foreignTrade: `url(${foreignTradeCardImage})`,
  logisticsPerformance: `url(${logisticsPerformanceCardImage})`,
  aqabaSez: `url(${aqabaSezCardImage})`,
  foreignTradeLogistics: `url(${foreignTradeLogisticsCardImage})`,
  statistics: `url(${statisticsCardImage})`,

  // foreignTrade: `linear-gradient(rgba(26, 82, 118, 0.56), rgba(46, 134, 193, 0.62)), url(${foreignTradeCardImage})`,
  // logisticsPerformance: `linear-gradient(rgba(14, 90, 150, 0.55), rgba(27, 117, 188, 0.64)), url(${logisticsPerformanceCardImage})`,
  // aqabaSez: `linear-gradient(rgba(17, 122, 101, 0.52), rgba(26, 188, 156, 0.62)), url(${aqabaSezCardImage})`,
  // foreignTradeLogistics: `linear-gradient(rgba(27, 79, 114, 0.56), rgba(40, 116, 166, 0.62)), url(${foreignTradeLogisticsCardImage})`,
  // statistics: `linear-gradient(rgba(36, 113, 163, 0.54), rgba(93, 173, 226, 0.62)), url(${statisticsCardImage})`,

} as const;

export const statBackgrounds = {
  imports: `url(${foreignTradeCardImage})`,
  exports: `url(${heroSlide11})`,
  tradeBalance: `url(${aqabaSezCardImage})`,
  containers: `url(${logisticsPerformanceCardImage})`,
  carMovements: `url(${statisticsCardImage})`,
  truckMovements: `url(${foreignTradeLogisticsCardImage})`,
} as const;

export { default as portalLogo } from './logo.png';

export const partnerLogoImages = {
  execution1: executionLogo1,
  execution2: executionLogo2,
  partnership1: partnershipLogo1,
  partnership2: partnershipLogo2,
  partnership3: partnershipLogo3,
  funded1: fundedLogo1,
  funded2: fundedLogo2,
} as const;
