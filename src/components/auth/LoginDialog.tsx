import { useState, type FormEvent } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Fade,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/routes/paths';
import { useAuth } from '../../hooks/useAuth';
import { getLoginErrorMessage } from '../../utils/authErrors';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const panelReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(12px, -18px); }
`;

const underlineFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: (theme: { palette: { mode: string } }) =>
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(27, 117, 188, 0.04)',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    '& fieldset': {
      borderColor: 'transparent',
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: (theme: { palette: { primary: { main: string } } }) =>
        alpha(theme.palette.primary.main, 0.35),
    },
    '&.Mui-focused': {
      bgcolor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
      boxShadow: (theme: { palette: { primary: { main: string } } }) =>
        `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
      '& fieldset': {
        borderColor: 'primary.main',
        borderWidth: 1.5,
      },
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'primary.main',
    fontWeight: 600,
  },
};

export const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loginMutation } = useAuth();
  const isDarkMode = theme.palette.mode === 'dark';

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const isFormValid = username.trim().length > 0 && password.trim().length > 0;

  const handleClose = () => {
    if (!loginMutation.isPending) {
      loginMutation.reset();
      setShowValidation(false);
      setShowPassword(false);
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowValidation(true);

    if (!isFormValid) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 30,
      });
      handleClose();
      navigate(ROUTES.OPERATION);
    } catch {
      // Error is surfaced via loginMutation.error
    }
  };

  const errorMessage = loginMutation.isError
    ? getLoginErrorMessage(loginMutation.error, t('auth.loginError'))
    : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      aria-labelledby="login-access-title"
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.78)' : 'rgba(47, 56, 63, 0.32)',
            backdropFilter: 'blur(10px)',
          },
        },
      }}
    >
      <Fade in={open} timeout={280}>
        <Box
          onClick={handleClose}
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 0, sm: 2, md: 3 },
            outline: 'none',
          }}
        >
          <Box
            component="section"
            onClick={(event) => event.stopPropagation()}
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 1080,
              minHeight: { xs: '100dvh', sm: 560 },
              maxHeight: { xs: '100dvh', sm: '92dvh' },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
              borderRadius: { xs: 0, sm: 4 },
              overflow: 'hidden',
              boxShadow: isDarkMode
                ? '0 32px 80px rgba(0, 0, 0, 0.55)'
                : '0 32px 80px rgba(27, 117, 188, 0.22)',
              animation: `${panelReveal} 0.45s cubic-bezier(0.22, 1, 0.36, 1)`,
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            {/* Brand atmosphere panel */}
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 4,
                color: '#FFFFFF',
                overflow: 'hidden',
                background: `linear-gradient(145deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 42%, ${theme.palette.hero.light} 100%)`,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.22) 0%, transparent 42%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.12) 0%, transparent 38%)',
                  pointerEvents: 'none',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  border: '2px dashed rgba(255,255,255,0.28)',
                  insetInlineStart: '-8%',
                  top: '18%',
                  animation: `${orbFloat} 9s ease-in-out infinite`,
                  pointerEvents: 'none',
                  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.08)',
                  insetInlineEnd: '8%',
                  bottom: '22%',
                  animation: `${orbFloat} 7s ease-in-out infinite reverse`,
                  pointerEvents: 'none',
                  '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
                }}
              />

              <Stack direction="row" spacing={1} sx={{ position: 'relative', zIndex: 1, alignItems: 'center' }}>
                <ShieldOutlinedIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, letterSpacing: 0.4, opacity: 0.92 }}>
                  {t('header.customsDept')}
                </Typography>
              </Stack>

              <Box sx={{ position: 'relative', zIndex: 1, my: 4 }}>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{ fontWeight: 800, lineHeight: 1.35, maxWidth: 420, mb: 2 }}
                >
                  {t('hero.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8, maxWidth: 400 }}>
                  {t('hero.description')}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ position: 'relative', zIndex: 1, opacity: 0.75 }}>
                {t('header.portalSubtitle')}
              </Typography>
            </Box>

            {/* Form panel */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                p: { xs: 3, sm: 4, md: 5 },
              }}
            >
              <IconButton
                onClick={handleClose}
                disabled={loginMutation.isPending}
                aria-label={t('auth.cancel')}
                sx={{
                  position: 'absolute',
                  top: { xs: 12, sm: 16 },
                  insetInlineEnd: { xs: 12, sm: 16 },
                  bgcolor: (muiTheme) => alpha(muiTheme.palette.primary.main, 0.08),
                  '&:hover': {
                    bgcolor: (muiTheme) => alpha(muiTheme.palette.primary.main, 0.14),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
                <Box
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    mb: 3,
                    p: 2,
                    borderRadius: 3,
                    color: 'primary.contrastText',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.hero.light})`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5 }}>
                    {t('header.customsDept')}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
                    {t('hero.title')}
                  </Typography>
                </Box>

                <Typography
                  id="login-access-title"
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: 800, mb: 0.75, letterSpacing: '-0.02em' }}
                >
                  {t('auth.loginTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3.5, maxWidth: 360 }}>
                  {t('header.portalSubtitle')}
                </Typography>

                <Collapse in={Boolean(errorMessage)}>
                  {errorMessage && (
                    <Alert severity="error" variant="filled" sx={{ mb: 2.5, borderRadius: 2 }}>
                      {errorMessage}
                    </Alert>
                  )}
                </Collapse>

                <Stack spacing={2.25}>
                  <TextField
                    autoFocus
                    label={t('auth.username')}
                    type="text"
                    fullWidth
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    disabled={loginMutation.isPending}
                    error={showValidation && username.trim().length === 0}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutlinedIcon fontSize="small" color="primary" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={underlineFieldSx}
                  />
                  <TextField
                    label={t('auth.password')}
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={loginMutation.isPending}
                    error={showValidation && password.trim().length === 0}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlinedIcon fontSize="small" color="primary" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              disabled={loginMutation.isPending}
                              size="small"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon fontSize="small" />
                              ) : (
                                <VisibilityIcon fontSize="small" />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={underlineFieldSx}
                  />
                </Stack>

                <Box
                  component="button"
                  type="submit"
                  disabled={loginMutation.isPending}
                  sx={{
                    mt: 3.5,
                    width: '100%',
                    border: 'none',
                    borderRadius: 3,
                    py: 1.6,
                    px: 2.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    cursor: loginMutation.isPending ? 'wait' : 'pointer',
                    color: '#FFFFFF',
                    fontFamily: 'inherit',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.hero.dark} 100%)`,
                    boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.35)}`,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
                    '&:hover': {
                      transform: loginMutation.isPending ? 'none' : 'translateY(-2px)',
                      boxShadow: `0 16px 36px ${alpha(theme.palette.primary.main, 0.42)}`,
                    },
                    '&:disabled': {
                      opacity: 0.72,
                    },
                  }}
                >
                  {loginMutation.isPending ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    <>
                      {t('auth.login')}
                      <ArrowForwardIcon
                        sx={{
                          fontSize: 20,
                          transform: theme.direction === 'rtl' ? 'scaleX(-1)' : 'none',
                        }}
                      />
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
