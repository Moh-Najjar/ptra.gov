import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../app/routes/paths';
import { CONTACT_SECTIONS, getContactHref } from '../constants/contactContent';
import type { ContactDetailItem } from '../types/contact';

interface ContactDetailRowProps {
  item: ContactDetailItem;
}

const ContactDetailRow = ({ item }: ContactDetailRowProps) => {
  const { t } = useTranslation();
  const value = t(item.valueKey);
  const href = getContactHref(item.linkType, value);
  const label = item.labelKey ? t(item.labelKey) : undefined;

  return (
    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
      {label && (
        <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {`${label}: `}
        </Box>
      )}
      {href ? (
        <Link href={href} underline="hover" color="primary">
          {value}
        </Link>
      ) : (
        <Box component="span">{value}</Box>
      )}
    </Typography>
  );
};

export const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={ROUTES.HOME} underline="hover" color="inherit">
          {t('common.home')}
        </Link>
        <Typography color="text.primary">{t('pages.contact.title')}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
        {t('pages.contact.title')}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.9, maxWidth: '90ch' }}>
        {t('contact.intro')}
      </Typography>

      <Grid container spacing={2.5}>
        {CONTACT_SECTIONS.map((section) => (
          <Grid key={section.id} size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.28)
                    : alpha(theme.palette.primary.main, 0.18),
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.primary.main, 0.06),
                p: { xs: 2.5, md: 3 },
                transition: 'background-color 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.14)
                      : alpha(theme.palette.primary.main, 0.09),
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.36)
                      : alpha(theme.palette.primary.main, 0.24),
                },
              }}
            >
              <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t(section.titleKey)}
              </Typography>

              <Stack spacing={1.5}>
                {section.items.map((item) => (
                  <ContactDetailRow key={item.id} item={item} />
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
