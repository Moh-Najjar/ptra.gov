import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Alert, Box, LinearProgress, Snackbar, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/routes/paths';
import {
  AUTH_UNAUTHORIZED_EVENT,
  SESSION_EXPIRY_WARNING_SECONDS,
} from '../../constants/sessionExpiry';
import { useAuth } from '../../hooks/useAuth';
import { getDirection } from '../../i18n/types';
import { getExpiryCountdownSeconds, getMillisecondsUntilExpiryWarning } from '../../utils/sessionExpiry';

export const SessionExpiryWatcher = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { session, logoutMutation } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const initialSecondsRef = useRef(SESSION_EXPIRY_WARNING_SECONDS);
  const isWarningActiveRef = useRef(false);
  const isLoggingOutRef = useRef(false);
  const language = i18n.language === 'en' ? 'en' : 'ar';
  const snackbarHorizontal = getDirection(language) === 'rtl' ? 'left' : 'right';

  const startCountdown = useCallback((seconds: number) => {
    if (isWarningActiveRef.current || isLoggingOutRef.current) {
      return;
    }

    const nextSeconds = Math.max(1, seconds);
    isWarningActiveRef.current = true;
    initialSecondsRef.current = nextSeconds;
    setSecondsLeft(nextSeconds);
  }, []);

  const forceLogout = useCallback(async () => {
    if (isLoggingOutRef.current) {
      return;
    }

    isLoggingOutRef.current = true;
    isWarningActiveRef.current = false;
    setSecondsLeft(null);

    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate(ROUTES.HOME, { replace: true });
      isLoggingOutRef.current = false;
    }
  }, [logoutMutation, navigate]);

  useEffect(() => {
    if (!session) {
      isWarningActiveRef.current = false;
      isLoggingOutRef.current = false;
      setSecondsLeft(null);
      return;
    }

    const delayMs = Math.max(0, getMillisecondsUntilExpiryWarning(session.expiresAt));
    const warningTimer = window.setTimeout(() => {
      startCountdown(getExpiryCountdownSeconds(session.expiresAt));
    }, delayMs);

    return () => {
      window.clearTimeout(warningTimer);
    };
  }, [session, startCountdown]);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (!session) {
        return;
      }

      startCountdown(SESSION_EXPIRY_WARNING_SECONDS);
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [session, startCountdown]);

  useEffect(() => {
    if (secondsLeft === null) {
      return;
    }

    if (secondsLeft <= 0) {
      void forceLogout();
      return;
    }

    const tickTimer = window.setTimeout(() => {
      setSecondsLeft((currentSeconds) => (currentSeconds === null ? null : currentSeconds - 1));
    }, 1000);

    return () => {
      window.clearTimeout(tickTimer);
    };
  }, [forceLogout, secondsLeft]);

  const isOpen = secondsLeft !== null && secondsLeft > 0;
  const progress =
    initialSecondsRef.current > 0
      ? (Math.max(secondsLeft ?? 0, 0) / initialSecondsRef.current) * 100
      : 0;

  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={{ vertical: 'top', horizontal: snackbarHorizontal }}
    >
      <Alert
        icon={<WarningAmberOutlinedIcon />}
        severity="warning"
        variant="filled"
        sx={{
          width: { xs: '100%', sm: 360 },
          alignItems: 'flex-start',
          boxShadow: 4,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>
          {t('auth.sessionExpiringTitle')}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
          {t('auth.sessionExpiringMessage', { count: secondsLeft ?? 0 })}
        </Typography>
        <Box sx={{ mt: 1.5 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="inherit"
            sx={{ height: 6, borderRadius: 999 }}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 0.75, fontWeight: 700 }}>
            {t('auth.sessionExpiringCountdown', { count: secondsLeft ?? 0 })}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};
