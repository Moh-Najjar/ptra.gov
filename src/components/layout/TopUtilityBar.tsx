import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Tooltip,
} from '@mui/material';
import type { ReactElement } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { UTILITY_LINKS } from '../../constants/navigation';
import { useColorMode } from '../../hooks/useColorMode';
import { useFontSize } from '../../hooks/useFontSize';
import { useLanguage } from '../../hooks/useLanguage';

const iconButtonSx = {
  color: 'utilityBar.contrastText',
  p: 0.5,
  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
};

const fontSizeControlSx = {
  color: 'utilityBar.contrastText',
  fontWeight: 700,
  fontSize: '0.875rem',
  lineHeight: 1,
  minWidth: 28,
  height: 28,
  border: 'none',
  bgcolor: 'transparent',
  cursor: 'pointer',
  px: 0.5,
  borderRadius: 1,
  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
  '&:disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
};

type SocialLink = {
  id: 'youtube' | 'whatsapp' | 'x' | 'facebook';
  label: string;
  href: string;
  icon: ReactElement;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/channel/UC4x80a6SbSG7IzCC-IRT0FA',
    icon: <YouTubeIcon fontSize="small" />,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send/?phone=962780349516&text&type=phone_number&app_absent=0',
    icon: <WhatsAppIcon fontSize="small" />,
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/JC_Department',
    icon: <XIcon fontSize="small" />,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://web.facebook.com/JordanCustomsOfficial#',
    icon: <FacebookIcon fontSize="small" />,
  },
];

export const TopUtilityBar = () => {
  const { t } = useTranslation();
  const { toggleLanguage, switchLabel } = useLanguage();
  const { isDarkMode, toggleColorMode } = useColorMode();
  const { decreaseFontSize, increaseFontSize, canDecrease, canIncrease } = useFontSize();

  const colorModeTooltip = isDarkMode ? t('utility.switchToLightMode') : t('utility.switchToDarkMode');

  return (
    <Box
      sx={{
        bgcolor: 'utilityBar.main',
        borderBottom: '1px solid',
        borderColor: 'primary.light',
        py: 1.5,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Link
            component="button"
            type="button"
            onClick={toggleLanguage}
            underline="hover"
            sx={{
              color: 'utilityBar.contrastText',
              fontWeight: 600,
              fontSize: '0.875rem',
              border: 'none',
              bgcolor: 'transparent',
              cursor: 'pointer',
            }}
          >
            {switchLabel}
          </Link>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.path}
                component={RouterLink}
                to={link.path}
                underline="hover"
                sx={{ color: 'utilityBar.contrastText', fontSize: '0.875rem' }}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {SOCIAL_LINKS.map((socialLink) => (
              <Tooltip key={socialLink.id} title={socialLink.label}>
                <IconButton
                  size="small"
                  sx={iconButtonSx}
                  aria-label={socialLink.label}
                  component="a"
                  href={socialLink.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialLink.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
            <Tooltip title={t('utility.favorites')}>
              <IconButton size="small" sx={iconButtonSx} aria-label={t('utility.favorites')}>
                <StarBorderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('utility.print')}>
              <IconButton size="small" sx={iconButtonSx} aria-label={t('utility.print')}>
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('utility.decreaseFontSize')}>
              <Box
                component="button"
                type="button"
                onClick={decreaseFontSize}
                disabled={!canDecrease}
                aria-label={t('utility.decreaseFontSize')}
                sx={fontSizeControlSx}
              >
                A-
              </Box>
            </Tooltip>
            <Tooltip title={t('utility.increaseFontSize')}>
              <Box
                component="button"
                type="button"
                onClick={increaseFontSize}
                disabled={!canIncrease}
                aria-label={t('utility.increaseFontSize')}
                sx={fontSizeControlSx}
              >
                A+
              </Box>
            </Tooltip>
            <Tooltip title={t('utility.search')}>
              <IconButton size="small" sx={iconButtonSx} aria-label={t('utility.search')}>
                <SearchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={colorModeTooltip}>
              <IconButton
                size="small"
                sx={iconButtonSx}
                aria-label={colorModeTooltip}
                onClick={toggleColorMode}
              >
                {isDarkMode ? (
                  <LightModeOutlinedIcon fontSize="small" />
                ) : (
                  <DarkModeOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
