import { PagePlaceholder } from '../components/common/PagePlaceholder';
import { PowerBiPage } from '../components/common/PowerBiPage';

export { AccessibilityPage } from './AccessibilityPage';
export { MyAccountPage } from './MyAccountPage';
export { ContactPage } from './ContactPage';
export { PrivacyPage } from './PrivacyPage';
export { AboutPage } from './AboutPage';
export { HomePage } from './HomePage';
export { FaqPage } from './FaqPage';
export { PagesPage } from './PagesPage';
export { PostPage } from './PostPage';
export { UsersPage } from './UsersPage';
export { SurveysPage } from './SurveysPage';

export const ForeignTradePage = () => <PagePlaceholder titleKey="pages.foreignTrade.title" />;

export const ContainerDwellTimePage = () => <PowerBiPage reportId="containerDwellTime" />;

export const StatisticsPage = () => <PagePlaceholder titleKey="pages.statistics.title" />;

export const TradeBalancePage = () => <PowerBiPage reportId="tradeBalance" />;

export const ReleaseTimePage = () => <PowerBiPage reportId="releaseTime" />;

export const AqabaSezPage = () => <PowerBiPage reportId="aqabaSez" />;

export const ExportsPage = () => <PowerBiPage reportId="exports" />;

export const ImportsPage = () => <PowerBiPage reportId="imports" />;

export const TransitPage = () => <PowerBiPage reportId="transit" />;

export const CropsPage = () => <PowerBiPage reportId="crops" />;


export const ForeignTradeLogisticsPage = () => (
  <PagePlaceholder titleKey="pages.foreignTradeLogistics.title" />
);

export const ContainerFlowStatisticsPage = () => (
  <PowerBiPage reportId="containerFlowStatistics" />
);

