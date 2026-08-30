import {
  Box,
  Container,
  IconButton,
  Link,
  Stack,
  Tooltip,
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { UTILITY_LINKS } from '../../constants/navigation';
import { SOCIAL_LINKS } from '../../constants/socialLinks';
import { useColorMode } from '../../hooks/useColorMode';
import { useFontSize } from '../../hooks/useFontSize';
import { useLanguage } from '../../hooks/useLanguage';
import { rem } from '../../theme/rem';

const iconButtonSx = {
  color: 'utilityBar.contrastText',
  p: 0.5,
  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
};

const fontSizeControlSx = {
  color: 'utilityBar.contrastText',
  fontWeight: 700,
  fontSize: '0.8125rem',
  lineHeight: 1,
  minWidth: rem(36),
  height: rem(36),
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
        borderBottom: '0.0625rem solid',
        borderColor: 'primary.light',
        py: { xs: 0.5, md: 1.25 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            gap: { xs: 0.75, md: 1 },
            minHeight: { xs: 0, md: rem(28) },
          }}
        >
          {/* Language stays visible on every breakpoint — it is a primary action. */}
          <Box
            component="button"
            type="button"
            onClick={toggleLanguage}
            aria-label={switchLabel}
            sx={{
              color: 'utilityBar.contrastText',
              fontWeight: 700,
              fontSize: '0.8125rem',
              lineHeight: 1,
              border: '0.0625rem solid rgba(255, 255, 255, 0.38)',
              bgcolor: 'rgba(255, 255, 255, 0.12)',
              cursor: 'pointer',
              borderRadius: 999,
              px: { xs: 1.25, md: 1.5 },
              py: 0.45,
              flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.22)' },
            }}
          >
            {switchLabel}
          </Box>

          {/* Portal pages live in the mobile drawer instead of this crowded strip. */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: 'center',
              display: { xs: 'none', md: 'flex' },
            }}
          >
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

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
              display: { xs: 'none', md: 'flex' },
            }}
          >
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
                  <socialLink.Icon fontSize="small" />
                </IconButton>
              </Tooltip>
            ))}
          </Stack>

          <Stack direction="row" spacing={0.15} sx={{ alignItems: 'center', flexShrink: 0 }}>
            {/* Print, favorites, and search are desktop-only — they are unused or awkward on phones. */}
            <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
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
            </Box>
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
            <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
              <Tooltip title={t('utility.search')}>
                <IconButton size="small" sx={iconButtonSx} aria-label={t('utility.search')}>
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
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
