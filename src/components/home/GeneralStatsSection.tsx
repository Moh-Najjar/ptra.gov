import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeneralStats } from '../../hooks/queries/useGeneralStats';
import { StatCircle, type StatCircleSize } from '../common/StatCircle';

const SIZE_PATTERN: StatCircleSize[] = ['xl', 'md', 'sm', 'md', 'sm', 'xl'];

/** End circles sit above middle ones, matching the reference layering. */
const Z_INDEX_PATTERN = [6, 3, 2, 2, 3, 6];

const titleFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const GeneralStatsSection = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError } = useGeneralStats();
  const stackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = stackRef.current;
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
      { threshold: 0.25, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stats]);

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            mb: { xs: 3, md: 5 },
            fontWeight: 700,
            textAlign: 'center',
            color: 'text.primary',
            opacity: isVisible ? 1 : 0,
            animation: isVisible
              ? `${titleFadeIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`
              : 'none',
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
              opacity: 1,
            },
          }}
        >
          {t('home.statsTitle')}
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
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
            ref={stackRef}
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
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {stats.map((stat, index) => (
                <StatCircle
                  key={stat.id}
                  value={stat.value}
                  label={stat.label}
                  background={stat.background}
                  size={SIZE_PATTERN[index % SIZE_PATTERN.length]}
                  overlap={index > 0}
                  index={index}
                  zIndex={Z_INDEX_PATTERN[index % Z_INDEX_PATTERN.length]}
                  isVisible={isVisible}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
