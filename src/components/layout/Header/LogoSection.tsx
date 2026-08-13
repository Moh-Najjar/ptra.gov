import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';
import { portalLogoAr, portalLogoEn } from '../../../assets/images';
import { useLanguage } from '../../../hooks/useLanguage';

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
          height: { xs: 48, md: 64 },
          width: 'auto',
          maxWidth: { xs: 220, sm: 320, lg: 480 },
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </Box>
  );
};
