import {
  Box,
  CircularProgress,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import { alpha, keyframes } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeneralStats } from '../../hooks/useGeneralStats';
import type { TranslatedStatisticItem } from '../../types/statistics';

const GRID_COLUMNS = { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' } as const;
const COUNT_UP_DURATION_MS = 1400;
const STAGGER_DELAY_S = 0.08;

const sectionReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cardReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

/** Returns a numeric target when the stat value is a plain integer string. */
const parseNumericStatValue = (value: string): number | null => {
  const normalized = value.replace(/,/g, '').trim();
  if (!/^\d+$/.test(normalized)) {
    return null;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

/** Formats large integers with grouping separators for readability. */
const formatStatDisplayValue = (value: string, numericValue: number | null): string => {
  if (numericValue === null) {
    return value;
  }
  return numericValue.toLocaleString();
};

interface UseCountUpResult {
  displayValue: string;
}

/** Animates numeric stat values when the section enters the viewport. */
const useCountUp = (
  rawValue: string,
  isActive: boolean,
  durationMs: number = COUNT_UP_DURATION_MS,
): UseCountUpResult => {
  const numericTarget = parseNumericStatValue(rawValue);
  const [displayValue, setDisplayValue] = useState<string>(() =>
    formatStatDisplayValue(rawValue, numericTarget),
  );

  useEffect(() => {
    if (numericTarget === null) {
      setDisplayValue(rawValue);
      return;
    }

    if (!isActive) {
      setDisplayValue(formatStatDisplayValue('0', 0));
      return;
    }

    let frameId = 0;
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      const currentValue = Math.round(numericTarget * easedProgress);
      setDisplayValue(formatStatDisplayValue(String(currentValue), currentValue));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [rawValue, numericTarget, isActive, durationMs]);

  return { displayValue };
};

interface StatCardV2Props {
  stat: TranslatedStatisticItem;
  index: number;
  isVisible: boolean;
}

const StatCardV2 = ({ stat, index, isVisible }: StatCardV2Props) => {
  const { displayValue } = useCountUp(stat.value, isVisible);
  const animationDelay = `${index * STAGGER_DELAY_S}s`;

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 148, sm: 168, md: 188 },
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: { xs: 2, md: 2.5 },
        color: '#FFFFFF',
        backgroundImage: `url(${stat.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: (theme) =>
          `0 10px 28px ${alpha(theme.palette.common.black, 0.14)}`,
        opacity: isVisible ? 1 : 0,
        animation: isVisible
          ? `${cardReveal} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards`
          : 'none',
        animationDelay,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          opacity: 1,
          transition: 'none',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.62) 100%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          insetBlock: 0,
          insetInlineStart: 0,
          width: 4,
          bgcolor: 'primary.light',
        },
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            `0 16px 36px ${alpha(theme.palette.common.black, 0.22)}`,
        },
      }}
    >
      <Typography
        component="p"
        sx={{
          position: 'relative',
          zIndex: 1,
          m: 0,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
        }}
      >
        {displayValue}
      </Typography>
      <Typography
        component="p"
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: 0.75,
          m: 0,
          fontWeight: 500,
          lineHeight: 1.35,
          fontSize: { xs: '0.72rem', sm: '0.8rem', md: '0.875rem' },
          opacity: 0.95,
        }}
      >
        {stat.label}
      </Typography>
    </Box>
  );
};

const StatsGridSkeleton = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: GRID_COLUMNS,
      gap: { xs: 1.5, md: 2 },
    }}
  >
    {Array.from({ length: 6 }, (_, index) => (
      <Skeleton
        key={`stat-skeleton-${index}`}
        variant="rounded"
        sx={{
          minHeight: { xs: 148, sm: 168, md: 188 },
          borderRadius: 3,
        }}
      />
    ))}
  </Box>
);

export const GeneralStatsSectionV2 = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError } = useGeneralStats();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !stats?.length) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -48px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stats]);

  return (
    <Box
      component="section"
      aria-labelledby="general-stats-v2-title"
      sx={(theme) => ({
        py: { xs: 5, md: 7 },
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, ${theme.palette.background.default} 72%)`,
      })}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: { xs: 3, md: 4.5 },
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            animation: isVisible
              ? `${sectionReveal} 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`
              : 'none',
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
              opacity: 1,
            },
          }}
        >
          <Typography
            id="general-stats-v2-title"
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, mb: 1.5 }}
          >
            {t('home.statsTitle')}
          </Typography>
          <Box
            sx={{
              width: 56,
              height: 4,
              mx: 'auto',
              borderRadius: 2,
              bgcolor: 'primary.main',
            }}
          />
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={32} />
            </Box>
            <StatsGridSkeleton />
          </Box>
        )}

        {isError && (
          <Typography sx={{ textAlign: 'center', color: 'error.main' }}>
            {t('stats.loadError')}
          </Typography>
        )}

        {stats && (
          <Box
            ref={sectionRef}
            sx={{
              display: 'grid',
              gridTemplateColumns: GRID_COLUMNS,
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {stats.map((stat, index) => (
              <StatCardV2
                key={stat.id}
                stat={stat}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};
