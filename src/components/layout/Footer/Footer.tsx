import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  FOOTER_LINK_GROUPS,
  PARTNER_GROUP_LABEL_KEYS,
  PARTNER_LOGOS,
  POWERED_BY_URL,
} from '../../../constants/footerLinks';
import { useSurvey } from '../../../contexts/SurveyContext';
import { useWebsiteVisitors } from '../../../hooks/useWebsiteVisitors';
import type { FooterLink, PartnerLogo } from '../../../types/navigation';

const PartnerLogoImage = ({ logo }: { logo: PartnerLogo }) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 0.75, sm: 1 },
        py: 0.5,
      }}
    >
      <Box
        component="img"
        src={logo.src}
        alt={t(logo.labelKey)}
        sx={{
          height: { xs: 40, sm: 44 },
          maxWidth: { xs: 100, sm: 120 },
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </Box>
  );
};

const PartnerGroup = ({ group }: { group: PartnerLogo['group'] }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const logos = PARTNER_LOGOS.filter((logo) => logo.group === group);

  return (
    <Stack
      direction="row"
      sx={{
        mb: 2,
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: { xs: 1.5, sm: 2 },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          flexShrink: 0,
          minWidth: { xs: 88, sm: isRtl ? 112 : 148 },
          whiteSpace: 'nowrap',
        }}
      >
        {t(PARTNER_GROUP_LABEL_KEYS[group])}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
          columnGap: { xs: 2, sm: 2.5, md: 3 },
          rowGap: 1.5,
        }}
      >
        {logos.map((logo) => (
          <PartnerLogoImage key={logo.id} logo={logo} />
        ))}
      </Box>
    </Stack>
  );
};

export const Footer = () => {
  const { t } = useTranslation();
  const { openSurvey } = useSurvey();
  // Load live visitor count from `/Counters/website-visitors`.
  const { data: visitorCount } = useWebsiteVisitors();

  const renderFooterLink = (link: FooterLink) => {
    if (link.action === 'survey') {
      return (
        <Box
          key={link.labelKey}
          component="button"
          type="button"
          onClick={openSurvey}
          sx={{
            border: 'none',
            bgcolor: 'transparent',
            cursor: 'pointer',
            p: 0,
            m: 0,
            textAlign: 'start',
            font: 'inherit',
            color: 'text.secondary',
            fontSize: '0.875rem',
            lineHeight: 1.43,
            textDecoration: 'none',
            display: 'block',
            width: '100%',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.main',
            },
          }}
        >
          {t(link.labelKey)}
        </Box>
      );
    }

    if (link.external && link.href) {
      return (
        <Link
          key={link.labelKey}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          color="text.secondary"
          variant="body2"
        >
          {t(link.labelKey)}
        </Link>
      );
    }

    return (
      <Link
        key={link.labelKey}
        component={RouterLink}
        to={link.path ?? '/'}
        underline="hover"
        color="text.secondary"
        variant="body2"
      >
        {t(link.labelKey)}
      </Link>
    );
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'footer.main',
        borderTop: '3px solid',
        borderColor: 'primary.main',
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 5 }}>
            <PartnerGroup group="execution" />
            <PartnerGroup group="partnership" />
            <PartnerGroup group="funding" />
          </Grid>

          {FOOTER_LINK_GROUPS.map((group) => (
            <Grid key={group.titleKey} size={{ xs: 12, sm: 6, md: 3.5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontSize: '1rem' }}>
                {t(group.titleKey)}
              </Typography>
              <Stack spacing={1}>
                {group.links.map((link) => renderFooterLink(link))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            lang="en"
            dir="ltr"
            sx={{ unicodeBidi: 'isolate' }}
          >
            {visitorCount !== undefined
              ? t('stats.visitorCount', { count: visitorCount })
              : null}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {t('footer.copyright')}
          </Typography>
          <Link
            href={POWERED_BY_URL}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="text.secondary"
            variant="body2"
          >
            {t('footer.poweredBy')}
          </Link>
        </Stack>
      </Container>
    </Box>
  );
};
