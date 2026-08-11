import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_CARDS } from '../../constants/dashboardCards';
import { DashboardCard } from '../common/DashboardCard';

export const DashboardCardsSection = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h2"
          sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}
        >
          {t('home.dashboardsTitle')}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            overflowX: 'auto',
            pb: 2,
            justifyContent: { md: 'center' },
          }}
        >
          {DASHBOARD_CARDS.map((card) => (
            <DashboardCard
              key={card.id}
              label={t(card.labelKey)}
              path={card.path}
              background={card.background}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};
