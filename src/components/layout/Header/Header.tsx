import { useMemo, useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { AppBar, Box, Button, Container, Toolbar, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../app/routes/paths';
import { LoginDialog } from '../../auth/LoginDialog';
import { useAuth } from '../../../hooks/useAuth';
import { LogoSection } from './LogoSection';
import { NavMenu } from './NavMenu';

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, logoutMutation } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      void logoutMutation.mutateAsync().then(() => {
        navigate(ROUTES.HOME);
      });
      return;
    }
    setLoginOpen(true);
  };

  const authTooltip = useMemo(
    () => (isAuthenticated ? t('auth.logout') : t('auth.login')),
    [isAuthenticated, t],
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5, gap: 2, minHeight: { xs: 64, md: 80 } }}>
            <Box sx={{ flexShrink: 0 }}>
              <LogoSection />
            </Box>

            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <NavMenu />
            </Box>

            <Tooltip title={authTooltip}>
              <Button
                type="button"
                onClick={handleAuthClick}
                variant="outlined"
                aria-label={authTooltip}
                disabled={logoutMutation.isPending}
                sx={{
                  minWidth: 48,
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  borderColor: 'text.primary',
                  color: 'text.primary',
                  flexShrink: 0,
                }}
              >
                {isAuthenticated ? <LogoutOutlinedIcon /> : <LockOutlinedIcon />}
              </Button>
            </Tooltip>
          </Toolbar>
        </Container>
      </AppBar>

      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};
