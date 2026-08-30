import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Trans, useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import { PRIVACY_SECTIONS } from '../constants/privacyContent';

export const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.privacy.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {t('pages.privacy.title')}
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
        <Stack spacing={3} divider={<Divider flexItem />}>
          {PRIVACY_SECTIONS.map((section) => (
            <Box key={section.id}>
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                {t(section.titleKey)}
              </Typography>

              {section.id === 'policyUpdates' ? (
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                  <Trans
                    i18nKey={section.bodyKey}
                    components={{
                      contactLink: (
                        <Link component={RouterLink} to={ROUTES.CONTACT} underline="hover" color="primary" />
                      ),
                    }}
                  />
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                  {t(section.bodyKey)}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  );
};
