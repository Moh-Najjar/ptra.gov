import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import {
  ACCESSIBILITY_MOBILE_PARAGRAPH_KEYS,
  ACCESSIBILITY_PARAGRAPH_KEYS,
} from '../constants/accessibilityContent';

export const AccessibilityPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.accessibility.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {t('pages.accessibility.title')}
      </Typography>

      <Box
        sx={{
          border: '0.0625rem solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.28)
              : alpha(theme.palette.primary.main, 0.18),
          borderRadius: 2,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.1)
              : alpha(theme.palette.primary.main, 0.06),
          p: { xs: 3, md: 4 },
        }}
      >
        <Stack spacing={2.5}>
          {ACCESSIBILITY_PARAGRAPH_KEYS.map((paragraphKey) => (
            <Typography
              key={paragraphKey}
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.9 }}
            >
              {t(paragraphKey)}
            </Typography>
          ))}

          <Box sx={{ pt: 1 }}>
            <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t('accessibility.mobile.title')}
            </Typography>

            <Stack spacing={2}>
              {ACCESSIBILITY_MOBILE_PARAGRAPH_KEYS.map((paragraphKey) => (
                <Typography
                  key={paragraphKey}
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.9 }}
                >
                  {t(paragraphKey)}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};
