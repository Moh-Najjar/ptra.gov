import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SurveyProvider } from '../../contexts/SurveyContext';
import { SurveyManager } from '../survey/SurveyManager';
import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';
import { TopUtilityBar } from './TopUtilityBar';

export const MainLayout = () => {
  return (
    <SurveyProvider>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopUtilityBar />
        <Header />
        <Box component="main" sx={{ flex: 1 }}>
          <Outlet />
        </Box>
        <Footer />
        <SurveyManager />
      </Box>
    </SurveyProvider>
  );
};
