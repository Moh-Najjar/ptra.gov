import { Box, Typography } from '@mui/material';
import { useReducedMotion } from 'motion/react';
import { useId } from 'react';
import { useCountUp } from 'react-countup';
import { formatSystemNumber } from '../../utils/formatNumber';
import { rem } from '../../theme/rem';

export type StatCircleSize = 'sm' | 'md' | 'lg' | 'xl';

/** Slow count-up so the value reads clearly as it rises. */
const COUNT_UP_DURATION_SECONDS = 3.2;

interface StatCircleSizeConfig {
  width: { xs: string; sm: string; md: string };
  valueFontSize: { xs: string; sm: string; md: string };
  labelFontSize: { xs: string; md: string };
  overlap: { xs: string; md: string };
}

const SIZE_CONFIG: Record<StatCircleSize, StatCircleSizeConfig> = {
  sm: {
    width: { xs: rem(128), sm: rem(146), md: rem(168) },
    valueFontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.9rem' },
    labelFontSize: { xs: '0.68rem', md: '0.8rem' },
    overlap: { xs: rem(22), md: rem(34) },
  },
  md: {
    width: { xs: rem(156), sm: rem(180), md: rem(206) },
    valueFontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.3rem' },
    labelFontSize: { xs: '0.74rem', md: '0.88rem' },
    overlap: { xs: rem(26), md: rem(40) },
  },
  lg: {
    width: { xs: rem(188), sm: rem(212), md: rem(244) },
    valueFontSize: { xs: '2.1rem', sm: '2.4rem', md: '2.7rem' },
    labelFontSize: { xs: '0.8rem', md: '0.95rem' },
    overlap: { xs: rem(30), md: rem(46) },
  },
  xl: {
    width: { xs: rem(216), sm: rem(242), md: rem(276) },
    valueFontSize: { xs: '2.4rem', sm: '2.7rem', md: '3rem' },
    labelFontSize: { xs: '0.95rem', md: '1.05rem' },
    overlap: { xs: rem(34), md: rem(50) },
  },
};

interface StatCircleProps {
  numericValue: number;
  fractionDigits?: number;
  /** English-formatted fallback when count-up is disabled. */
  value: string;
  label: string;
  background: string;
  size?: StatCircleSize;
  overlap?: boolean;
  zIndex?: number;
}

/** Animated English-numeral value using react-countup's named hook (Vite-safe). */
const StatCountUpValue = ({
  numericValue,
  fractionDigits,
}: {
  numericValue: number;
  fractionDigits: number;
}) => {
  // react-countup accepts a DOM id string; avoids React 19 RefObject<T | null> mismatch.
  const countUpId = `stat-countup-${useId().replaceAll(':', '')}`;

  useCountUp({
    ref: countUpId,
    start: 0,
    end: numericValue,
    duration: COUNT_UP_DURATION_SECONDS,
    decimals: fractionDigits,
    useEasing: true,
    // Keep Western digits while the rest of the UI may be Arabic.
    formattingFn: (animatedValue) =>
      formatSystemNumber(animatedValue, {
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
      }),
    enableScrollSpy: true,
    scrollSpyOnce: true,
    scrollSpyDelay: 120,
  });

  return <span id={countUpId} />;
};

export const StatCircle = ({
  numericValue,
  fractionDigits = 0,
  value,
  label,
  background,
  size = 'md',
  overlap = true,
  zIndex = 1,
}: StatCircleProps) => {
  const config = SIZE_CONFIG[size];
  const shouldReduceMotion = useReducedMotion();

  return (
    <Box
      sx={{
        position: 'relative',
        flexShrink: 0,
        width: config.width,
        height: config.width,
        borderRadius: '50%',
        overflow: 'hidden',
        background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFFFFF',
        px: 2,
        marginInlineStart: overlap
          ? { xs: `-${config.overlap.xs}`, md: `-${config.overlap.md}` }
          : 0,
        border: '0.1875rem solid #FFFFFF',
        boxShadow: '0 0.375rem 1.25rem rgba(0, 0, 0, 0.15)',
        zIndex,
        cursor: 'default',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(52, 98, 140, 0.28) 0%, rgba(30, 72, 110, 0.52) 100%)',
        },
      }}
    >
      <Typography
        component="span"
        lang="en"
        dir="ltr"
        sx={{
          position: 'relative',
          zIndex: 1,
          fontWeight: 700,
          lineHeight: 1.1,
          fontSize: config.valueFontSize,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'lining-nums tabular-nums',
          unicodeBidi: 'isolate',
        }}
      >
        {shouldReduceMotion ? (
          value
        ) : (
          <StatCountUpValue numericValue={numericValue} fractionDigits={fractionDigits} />
        )}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: 0.75,
          fontSize: config.labelFontSize,
          lineHeight: 1.35,
          fontWeight: 500,
          maxWidth: '88%',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};
