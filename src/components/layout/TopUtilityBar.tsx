import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Tooltip,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import XIcon from '@mui/icons-material/X';
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
            <Tooltip title="Instagram">
              <IconButton size="small" sx={iconButtonSx} aria-label="Instagram">
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="WhatsApp">
              <IconButton size="small" sx={iconButtonSx} aria-label="WhatsApp">
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="X">
              <IconButton size="small" sx={iconButtonSx} aria-label="X">
                <XIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Facebook">
              <IconButton size="small" sx={iconButtonSx} aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </IconButton>
            </Tooltip>
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
