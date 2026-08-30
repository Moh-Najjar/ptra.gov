import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../app/routes/paths';

interface PagePlaceholderProps {
  titleKey: string;
  descriptionKey?: string;
}

export const PagePlaceholder = ({ titleKey, descriptionKey }: PagePlaceholderProps) => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t(titleKey)}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          border: '0.0625rem dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: { xs: 4, md: 8 },
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {t(titleKey)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(descriptionKey ?? 'common.comingSoon')}
        </Typography>
      </Box>
    </Container>
  );
};
