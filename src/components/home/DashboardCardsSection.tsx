import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { DASHBOARD_CARDS } from '../../constants/dashboardCards';
import type { DashboardCardItem } from '../../types/statistics';

interface CollapsedCardProps {
  card: DashboardCardItem;
  label: string;
  shouldReduceMotion: boolean | null;
  onSelect: (cardId: string) => void;
}

/** Vertical card shown when not selected — fills its flex slot. */
const CollapsedCard = ({ card, label, shouldReduceMotion, onSelect }: CollapsedCardProps) => (
  <Box
    component="button"
    type="button"
    onClick={() => onSelect(card.id)}
    aria-pressed={false}
    aria-label={label}
    sx={{
      position: 'relative',
      display: 'block',
      width: '100%',
      height: { xs: 420, md: 450 },
      border: 'none',
      borderRadius: 10,
      overflow: 'hidden',
      cursor: 'pointer',
      background: card.background,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      p: 0,
      transition: shouldReduceMotion ? 'none' : 'transform 0.35s ease, filter 0.35s ease',
      '&:hover': {
        transform: shouldReduceMotion ? 'none' : 'translateY(-2px)',
        filter: 'brightness(1.02)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.42) 0%, rgba(0, 0, 0, 0.18) 100%)',
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
      {label}
    </Typography>
  </Box>
);

interface ExpandedCardProps {
  card: DashboardCardItem;
  label: string;
  description: string;
  readMoreLabel: string;
  shouldReduceMotion: boolean | null;
}

/** Wide detail layout shown after the user selects a card. */
const ExpandedCard = ({
  card,
  label,
  description,
  readMoreLabel,
  shouldReduceMotion,
}: ExpandedCardProps) => (
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
        {label}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        component={motion.p}
        layout
        sx={{ lineHeight: 1.8 }}
      >
        {description}
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
        {readMoreLabel}
      </Link>
    </Stack>

    <Box
      component={RouterLink}
      to={card.path}
      aria-label={label}
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
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.08) 100%)',
        },
      }}
    />
  </Box>
);

export const DashboardCardsSection = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  // Nothing selected until the user chooses a card.
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const activeCard = useMemo(
    () => DASHBOARD_CARDS.find((card) => card.id === activeCardId),
    [activeCardId],
  );

  if (DASHBOARD_CARDS.length === 0) {
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
            width: '100%',
            overflowX: 'auto',
            pb: 2,
            alignItems: 'stretch',
          }}
        >
          {DASHBOARD_CARDS.map((card) => {
            const isActive = activeCard?.id === card.id;
            const hasSelection = activeCard !== undefined;
            const label = t(card.labelKey);

            return (
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
                  // No selection: share full width evenly. With selection: expand active, shrink others.
                  flex: isActive
                    ? { xs: '1 0 85%', md: '1 1 62%' }
                    : hasSelection
                      ? { xs: '0 0 88px', md: '0 0 110px' }
                      : '1 1 0',
                  minWidth: isActive
                    ? { xs: 300, md: 0 }
                    : hasSelection
                      ? 88
                      : { xs: 140, sm: 0 },
                }}
              >
                {isActive ? (
                  <ExpandedCard
                    card={card}
                    label={label}
                    description={t(card.descriptionKey)}
                    readMoreLabel={t('dashboardCards.readMore')}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ) : (
                  <CollapsedCard
                    card={card}
                    label={label}
                    shouldReduceMotion={shouldReduceMotion}
                    onSelect={setActiveCardId}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
};
