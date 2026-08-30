import { useMemo, useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AppBar, Box, Button, Container, Toolbar, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LoginDialog } from '../../auth/LoginDialog';
import { useAuth } from '../../../hooks/useAuth';
import { rem } from '../../../theme/rem';
import { LogoSection } from './LogoSection';
import { MobileNav, NavMenu } from './NavMenu';
import { UserMenu } from './UserMenu';

/** Matching side slots keep the logo visually centered on phones. */
const MOBILE_SIDE_SLOT = rem(40);

export const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const authTooltip = useMemo(() => t('auth.login'), [t]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '0.0625rem solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              py: { xs: 0.5, md: 0.5 },
              gap: { xs: 1, md: 1.5 },
              minHeight: { xs: rem(56), md: rem(80) },
              flexWrap: 'nowrap',
            }}
          >
            {/* Menu sits on the inline-start edge so it is a thumb target. */}
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                width: MOBILE_SIDE_SLOT,
                flexShrink: 0,
                justifyContent: 'center',
              }}
            >
              <MobileNav />
            </Box>

            <Box
              sx={{
                // Grow only on phones so the lockup stays centered between the side slots.
                flex: { xs: 1, md: '0 0 auto' },
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
                minWidth: 0,
              }}
            >
              <LogoSection />
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flex: '1 1 auto',
                justifyContent: 'center',
                minWidth: 0,
              }}
            >
              <NavMenu />
            </Box>

            <Box
              sx={{
                flexShrink: 0,
                width: { xs: MOBILE_SIDE_SLOT, md: 'auto' },
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              {isAuthenticated && user ? (
                <UserMenu />
              ) : (
                <Tooltip title={authTooltip} open={loginOpen ? false : undefined}>
                  <Button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    variant="outlined"
                    aria-label={authTooltip}
                    sx={{
                      minWidth: { xs: rem(40), md: rem(48) },
                      width: { xs: rem(40), md: rem(48) },
                      height: { xs: rem(40), md: rem(48) },
                      borderRadius: 2,
                      borderColor: 'text.primary',
                      color: 'text.primary',
                      flexShrink: 0,
                      p: 0,
                    }}
                  >
                    <LockOutlinedIcon sx={{ fontSize: { xs: rem(20), md: rem(24) } }} />
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};
