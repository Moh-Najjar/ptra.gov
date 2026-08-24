import { Box, Typography } from '@mui/material';
import { useReducedMotion } from 'motion/react';
import CountUp from 'react-countup';

export type StatCircleSize = 'sm' | 'md' | 'lg' | 'xl';

/** Slow count-up so the value reads clearly as it rises. */
const COUNT_UP_DURATION_SECONDS = 3.2;

/** Always render Western Arabic (English) digits, even in ar/RTL UI. */
const formatEnglishNumber = (value: number, fractionDigits: number): string =>
  new Intl.NumberFormat('en-US', {
    numberingSystem: 'latn',
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);

interface StatCircleSizeConfig {
  width: { xs: number; sm: number; md: number };
  valueFontSize: { xs: string; sm: string; md: string };
  labelFontSize: { xs: string; md: string };
  overlapPx: { xs: number; md: number };
}

const SIZE_CONFIG: Record<StatCircleSize, StatCircleSizeConfig> = {
  sm: {
    width: { xs: 128, sm: 146, md: 168 },
    valueFontSize: { xs: '1.5rem', sm: '1.7rem', md: '1.9rem' },
    labelFontSize: { xs: '0.68rem', md: '0.8rem' },
    overlapPx: { xs: 22, md: 34 },
  },
  md: {
    width: { xs: 156, sm: 180, md: 206 },
    valueFontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.3rem' },
    labelFontSize: { xs: '0.74rem', md: '0.88rem' },
    overlapPx: { xs: 26, md: 40 },
  },
  lg: {
    width: { xs: 188, sm: 212, md: 244 },
    valueFontSize: { xs: '2.1rem', sm: '2.4rem', md: '2.7rem' },
    labelFontSize: { xs: '0.8rem', md: '0.95rem' },
    overlapPx: { xs: 30, md: 46 },
  },
  xl: {
    width: { xs: 216, sm: 242, md: 276 },
    valueFontSize: { xs: '2.4rem', sm: '2.7rem', md: '3rem' },
    labelFontSize: { xs: '0.95rem', md: '1.05rem' },
    overlapPx: { xs: 34, md: 50 },
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
          ? { xs: `-${config.overlapPx.xs}px`, md: `-${config.overlapPx.md}px` }
          : 0,
        border: '3px solid #FFFFFF',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
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
          // Force Latin digits even when the document direction is RTL/Arabic.
          fontVariantNumeric: 'lining-nums tabular-nums',
          unicodeBidi: 'isolate',
        }}
      >
        {shouldReduceMotion ? (
          value
        ) : (
          <CountUp
            start={0}
            end={numericValue}
            duration={COUNT_UP_DURATION_SECONDS}
            decimals={fractionDigits}
            useEasing
            formattingFn={(animatedValue) =>
              formatEnglishNumber(animatedValue, fractionDigits)
            }
            enableScrollSpy
            scrollSpyOnce
            scrollSpyDelay={120}
          />
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
