import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion, useReducedMotion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { DASHBOARD_CARDS } from '../../constants/dashboardCards';
import type { DashboardCardItem } from '../../types/statistics';
import { rem } from '../../theme/rem';

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
      height: rem(450),
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
        transform: shouldReduceMotion ? 'none' : 'translateY(-0.125rem)',
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
        bottom: rem(24),
        insetInlineEnd: rem(16),
        color: '#FFFFFF',
        fontWeight: 700,
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        transform: 'rotate(180deg)',
        letterSpacing: rem(1),
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
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: 2,
      minHeight: rem(450),
      overflow: 'hidden',
    }}
  >
    <Stack
      spacing={2}
      sx={{
        flex: 1,
        justifyContent: 'center',
        px: 2,
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
        width: rem(340),
        minHeight: '100%',
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

interface MobileDashboardRowProps {
  card: DashboardCardItem;
  label: string;
  description: string;
  readMoreLabel: string;
  shouldReduceMotion: boolean | null;
}

/** Full-width mobile card: image stacked above title, description, and a link. */
const MobileDashboardRow = ({
  card,
  label,
  description,
  readMoreLabel,
  shouldReduceMotion,
}: MobileDashboardRowProps) => {
  return (
    <Box
      component={RouterLink}
      to={card.path}
      aria-label={label}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'text.primary',
        bgcolor: 'background.paper',
        border: '0.0625rem solid',
        borderColor: 'divider',
        borderRadius: 3,
        boxShadow: (muiTheme) => `0 ${rem(6)} ${rem(18)} ${alpha(muiTheme.palette.primary.main, 0.08)}`,
        transition: shouldReduceMotion ? 'none' : 'transform 0.25s ease, box-shadow 0.25s ease',
        '&:hover': {
          transform: shouldReduceMotion ? 'none' : 'translateY(-0.125rem)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: rem(168),
          flexShrink: 0,
          background: card.background,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10, 40, 70, 0.08) 0%, rgba(10, 40, 70, 0.32) 100%)',
          }}
        />
      </Box>

      <Stack
        spacing={0.75}
        sx={{
          flex: 1,
          minWidth: 0,
          justifyContent: 'flex-start',
          px: 2,
          py: 1.75,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.35 }}>
          {label}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 600 }}>
          {description}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {readMoreLabel}
        </Typography>
      </Stack>
    </Box>
  );
};

export const DashboardCardsSection = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  // Nothing selected until the user chooses a card (desktop expand layout).
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
          sx={{ mb: { xs: 3, md: 4 }, fontWeight: 700, textAlign: 'center' }}
        >
          {t('home.dashboardsTitle')}
        </Typography>

        {/* Mobile: stacked image-over-copy cards — no side-by-side squeeze. */}
        <Stack spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
          {DASHBOARD_CARDS.map((card) => (
            <Box
              key={card.id}
              component={motion.div}
              initial={shouldReduceMotion ? false : { opacity: 0, y: rem(16) }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
            >
              <MobileDashboardRow
                card={card}
                label={t(card.labelKey)}
                description={t(card.descriptionKey)}
                readMoreLabel={t('dashboardCards.readMore')}
                shouldReduceMotion={shouldReduceMotion}
              />
            </Box>
          ))}
        </Stack>

        {/* Desktop: original expand / collapse strip. */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            display: { xs: 'none', md: 'flex' },
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
                  flex: isActive ? '1 1 62%' : hasSelection ? '0 0 6.875rem' : '1 1 0',
                  minWidth: isActive ? 0 : hasSelection ? rem(88) : 0,
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
