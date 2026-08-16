import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { AuthGuard } from '../../guards/AuthGuard';
import { RoleGuard } from '../../guards/RoleGuard';
import { ADMINISTRATOR_ROLE } from '../../types/roles';
import {
  AboutPage,
  AccessibilityPage,
  AqabaSezPage,
  ContactPage,
  ContainerDwellTimePage,
  CropsPage,
  FaqPage,
  ForeignTradeLogisticsPage,
  ContainerFlowStatisticsPage,
  ForeignTradePage,
  ExportsPage,
  ImportsPage,
  TransitPage,
  TradeBalancePage,
  HomePage,
  MyAccountPage,
  PagesPage,
  PostPage,
  PrivacyPage,
  ReleaseTimePage,
  StatisticsPage,
  UsersPage,
} from '../../pages';
import { ROUTES } from './paths';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.CROPS, element: <CropsPage /> },
      { path: ROUTES.FOREIGN_TRADE, element: <ForeignTradePage /> },
      { path: ROUTES.FOREIGN_TRADE_EXPORTS, element: <ExportsPage /> },
      { path: ROUTES.FOREIGN_TRADE_IMPORTS, element: <ImportsPage /> },
      { path: ROUTES.FOREIGN_TRADE_TRANSIT, element: <TransitPage /> },
      { path: ROUTES.FOREIGN_TRADE_BALANCE, element: <TradeBalancePage /> },
      { path: ROUTES.LOGISTICS_PERFORMANCE, element: <Navigate to={ROUTES.RELEASE_TIME} replace /> },
      { path: ROUTES.RELEASE_TIME, element: <ReleaseTimePage /> },
      { path: ROUTES.CONTAINER_DWELL_TIME, element: <ContainerDwellTimePage /> },
      { path: ROUTES.AQABA_SEZ, element: <AqabaSezPage /> },
      { path: ROUTES.FOREIGN_TRADE_LOGISTICS, element: <ForeignTradeLogisticsPage /> },
      { path: ROUTES.CONTAINER_FLOW_STATISTICS, element: <ContainerFlowStatisticsPage /> },
      { path: ROUTES.STATISTICS, element: <StatisticsPage /> },
      { path: ROUTES.FAQ, element: <FaqPage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: ROUTES.CONTACT, element: <ContactPage /> },
      { path: ROUTES.ACCESSIBILITY, element: <AccessibilityPage /> },
      { path: ROUTES.PRIVACY, element: <PrivacyPage /> },
      {
        element: <AuthGuard />,
        children: [
          { path: ROUTES.MY_ACCOUNT, element: <MyAccountPage /> },
          {
            element: <RoleGuard requiredRoles={[ADMINISTRATOR_ROLE]} />,
            children: [
              { path: ROUTES.POST, element: <PostPage /> },
              { path: ROUTES.PAGES, element: <PagesPage /> },
              { path: ROUTES.USERS, element: <UsersPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
