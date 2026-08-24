import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { DASHBOARD_CARDS } from '../../constants/dashboardCards';

export const DashboardCardsSection = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [activeCardId, setActiveCardId] = useState<string>(DASHBOARD_CARDS[0]?.id ?? '');

  const activeCard = useMemo(
    () => DASHBOARD_CARDS.find((card) => card.id === activeCardId) ?? DASHBOARD_CARDS[0],
    [activeCardId],
  );

  if (activeCard === undefined) {
    return null;
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h2"
          sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}
        >
          {t('home.dashboardsTitle')}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            overflowX: 'auto',
            pb: 2,
            alignItems: 'stretch',
            justifyContent: { md: 'center' },
          }}
        >
          {DASHBOARD_CARDS.map((card) => (
            <Box
              key={card.id}
              component={motion.div}
              layout
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 90, damping: 20, mass: 0.9 }
              }
              sx={{
                flex: card.id === activeCard.id ? '0 0 min(100%, 760px)' : '0 0 88px',
                minWidth: card.id === activeCard.id ? { xs: 320, md: 520 } : 88,
              }}
            >
              {card.id === activeCard.id ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    alignItems: 'stretch',
                    gap: 2,
                    minHeight: { xs: 420, md: 450 },
                    overflow: 'hidden',
                  }}
                >
                  <Stack
                    spacing={2}
                    sx={{
                      flex: 1,
                      justifyContent: 'center',
                      px: { xs: 1, md: 2 },
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" component={motion.h3} layout sx={{ fontWeight: 700 }}>
                      {t(card.labelKey)}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      component={motion.p}
                      layout
                      sx={{ lineHeight: 1.8 }}
                    >
                      {t(card.descriptionKey)}
                    </Typography>
                    <Link
                      component={RouterLink}
                      to={card.path}
                      underline="none"
                      sx={{
                        alignSelf: 'center',
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      {t('dashboardCards.readMore')}
                    </Link>
                  </Stack>

                  <Box
                    component={RouterLink}
                    to={card.path}
                    aria-label={t(card.labelKey)}
                    sx={{
                      position: 'relative',
                      display: 'block',
                      flex: '0 0 auto',
                      width: { xs: '100%', md: 340 },
                      minHeight: { xs: 280, md: '100%' },
                      borderRadius: 10,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      background: card.background,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: 6,
                      transition: shouldReduceMotion ? 'none' : 'transform 0.3s ease',
                      '&:hover': {
                        transform: shouldReduceMotion ? 'none' : 'scale(1.01)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.08) 100%)',
                      },
                    }}
                  />
                </Box>
              ) : (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setActiveCardId(card.id)}
                  sx={{
                    position: 'relative',
                    display: 'block',
                    width: 88,
                    minWidth: 88,
                    mx: 'auto',
                    height: { xs: 420, md: 450 },
                    border: 'none',
                    borderRadius: 10,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: card.background,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    p: 0,
                    transition: shouldReduceMotion
                      ? 'none'
                      : 'transform 0.35s ease, filter 0.35s ease',
                    '&:hover': {
                      transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
                      filter: 'brightness(1.02)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.18) 100%)',
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      insetInlineEnd: 16,
                      color: '#FFFFFF',
                      fontWeight: 700,
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      transform: 'rotate(180deg)',
                      letterSpacing: 1,
                      zIndex: 1,
                      p: 1,
                    }}
                  >
                    {t(card.labelKey)}
                  </Typography>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};
