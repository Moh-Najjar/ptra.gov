import { DashboardCardsSection } from '../components/home/DashboardCardsSection';
import { GeneralStatsSection } from '../components/home/GeneralStatsSection';
import { HeroSection } from '../components/home/HeroSection';

export const HomePage = () => {
  return (
    <>
      <HeroSection />
      <DashboardCardsSection />
      <GeneralStatsSection />
    </>
  );
};
