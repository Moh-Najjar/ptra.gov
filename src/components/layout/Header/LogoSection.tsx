import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';
import { portalLogoAr, portalLogoEn } from '../../../assets/images';
import { useLanguage } from '../../../hooks/useLanguage';
import { rem } from '../../../theme/rem';

export const LogoSection = () => {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  const portalLogo = useMemo(
    () => (direction === 'ltr' ? portalLogoEn : portalLogoAr),
    [direction],
  );

  return (
    <Box
      component={RouterLink}
      to={ROUTES.HOME}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      <Box
        component="img"
        src={portalLogo}
        alt={t('hero.title')}
        sx={{
          height: { xs: rem(42), md: rem(52), lg: rem(64) },
          width: 'auto',
          maxWidth: { xs: rem(200), sm: rem(280), md: rem(240), lg: rem(360), xl: rem(480) },
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </Box>
  );
};
