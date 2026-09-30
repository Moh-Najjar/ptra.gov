import {
  Alert,
  Box,
  Container,
  IconButton,
  Link,
  Snackbar,
  Stack,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PrintIcon from '@mui/icons-material/Print';
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

type UtilityNoticeSeverity = 'info' | 'error';

type UtilityNotice = {
  message: string;
  severity: UtilityNoticeSeverity;
};

/** Apple browsers bookmark with Command+D; other browsers use Ctrl+D. */
const usesAppleBookmarkShortcut = (): boolean => {
  const userAgent = navigator.userAgent;
  return /Mac|iPhone|iPad|iPod/i.test(userAgent);
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
  const [notice, setNotice] = useState<UtilityNotice | null>(null);

  const colorModeTooltip = isDarkMode ? t('utility.switchToLightMode') : t('utility.switchToDarkMode');

  const closeNotice = (): void => {
    setNotice(null);
  };

  // Browsers block silent bookmarking, so tell the visitor which shortcut to use.
  const handleAddToFavorites = (): void => {
    const message = usesAppleBookmarkShortcut()
      ? t('utility.addToFavoritesHintMac')
      : t('utility.addToFavoritesHint');

    setNotice({
      message,
      severity: 'info',
    });
  };

  const handlePrint = (): void => {
    try {
      window.print();
    } catch {
      setNotice({
        message: t('utility.printFailed'),
        severity: 'error',
      });
    }
  };
  // row-reverse keeps the Arabic links on the left, and mirrors that row in English.
  const flowDirection = 'row-reverse' as const;

  return (
    <Box
      className="no-print"
      sx={{
        bgcolor: 'utilityBar.main',
        borderBottom: '0.0625rem solid',
        borderColor: 'primary.light',
        py: { xs: 0.5, md: 1.25 },
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={flowDirection}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            gap: { xs: 0.75, md: 1 },
            minHeight: { xs: 0, md: rem(28) },
          }}
        >
          {/* Language and page links stay together on the physical left. */}
          <Stack
            direction={flowDirection}
            spacing={{ xs: 0, md: 2 }}
            sx={{ alignItems: 'center', minWidth: 0 }}
          >
            <Box
              component="button"
              type="button"
              onClick={toggleLanguage}
              aria-label={switchLabel}
              sx={{
                color: 'utilityBar.contrastText',
                fontWeight: 700,
                fontSize: '0.9rem',
                lineHeight: 1,
                border: 'none',
                bgcolor: '#6FB2D0',
                cursor: 'pointer',
                borderRadius: 999,
                px: { xs: 1.25, md: 1.5 },
                py: 0.6,
                flexShrink: 0,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.22)' },
              }}
            >
              {switchLabel}
            </Box>

            {/* Portal pages live in the mobile drawer instead of this crowded strip. */}
            <Stack
              direction={flowDirection}
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
          </Stack>

          <Stack
            direction={flowDirection}
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

          <Stack direction={flowDirection} spacing={0.15} sx={{ alignItems: 'center', flexShrink: 0 }}>
            {/* Print, favorites, and search are desktop-only — they are unused or awkward on phones. */}
            <Box
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                flexDirection: flowDirection,
                alignItems: 'center',
              }}
            >
              <Tooltip title={t('utility.favorites')}>
                <IconButton
                  size="small"
                  sx={iconButtonSx}
                  aria-label={t('utility.favorites')}
                  onClick={handleAddToFavorites}
                >
                  <StarBorderIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('utility.print')}>
                <IconButton
                  size="small"
                  sx={iconButtonSx}
                  aria-label={t('utility.print')}
                  onClick={handlePrint}
                >
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

      <Snackbar
        open={notice !== null}
        autoHideDuration={6000}
        onClose={closeNotice}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={notice?.severity ?? 'info'}
          onClose={closeNotice}
          sx={{ width: '100%' }}
        >
          {notice?.message ?? ''}
        </Alert>
      </Snackbar>
    </Box>
  );
};
