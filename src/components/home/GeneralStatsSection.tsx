import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useGeneralStats } from '../../hooks/queries/useGeneralStats';
import { StatCircle, type StatCircleSize } from '../common/StatCircle';

const SIZE_PATTERN: StatCircleSize[] = ['xl', 'md', 'sm', 'md', 'sm', 'xl'];

/** End circles sit above middle ones, matching the reference layering. */
const Z_INDEX_PATTERN = [6, 3, 2, 2, 3, 6];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -40px 0px' } as const;

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const statsContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const statCircleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export const GeneralStatsSection = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError } = useGeneralStats();
  const shouldReduceMotion = useReducedMotion();

  const motionInitial = shouldReduceMotion ? 'visible' : 'hidden';

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component={motion.h2}
          initial={motionInitial}
          whileInView="visible"
          viewport={VIEWPORT}
          variants={titleVariants}
          sx={{
            mb: { xs: 3, md: 5 },
            fontWeight: 700,
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          {t('home.statsTitle')}
        </Typography>

        {isLoading && (
          <Box
            component={motion.div}
            initial={motionInitial}
            whileInView="visible"
            viewport={VIEWPORT}
            variants={titleVariants}
            sx={{ display: 'flex', justifyContent: 'center', py: 4 }}
          >
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Typography sx={{ textAlign: 'center', color: 'error.main' }}>
            {t('stats.loadError')}
          </Typography>
        )}

        {stats && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              py: { xs: 2, md: 3 },
              px: { xs: 1, md: 0 },
              minHeight: { xs: 180, md: 260 },
            }}
          >
            <Box
              component={motion.div}
              initial={motionInitial}
              whileInView="visible"
              viewport={VIEWPORT}
              variants={statsContainerVariants}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {stats.map((stat, index) => (
                <Box
                  key={stat.id}
                  component={motion.div}
                  variants={statCircleVariants}
                  sx={{ display: 'flex' }}
                >
                  <StatCircle
                    value={stat.value}
                    label={stat.label}
                    background={stat.background}
                    size={SIZE_PATTERN[index % SIZE_PATTERN.length]}
                    overlap={index > 0}
                    zIndex={Z_INDEX_PATTERN[index % Z_INDEX_PATTERN.length]}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
