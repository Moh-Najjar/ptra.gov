import { Box, Typography } from '@mui/material';

export type StatCircleSize = 'sm' | 'md' | 'lg' | 'xl';

interface StatCircleSizeConfig {
  width: { xs: number; sm: number; md: number };
  valueFontSize: { xs: string; sm: string; md: string };
  labelFontSize: { xs: string; md: string };
  overlapPx: { xs: number; md: number };
}

const SIZE_CONFIG: Record<StatCircleSize, StatCircleSizeConfig> = {
  sm: {
    width: { xs: 108, sm: 122, md: 138 },
    valueFontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.65rem' },
    labelFontSize: { xs: '0.62rem', md: '0.72rem' },
    overlapPx: { xs: 18, md: 28 },
  },
  md: {
    width: { xs: 132, sm: 152, md: 172 },
    valueFontSize: { xs: '1.6rem', sm: '1.85rem', md: '2rem' },
    labelFontSize: { xs: '0.68rem', md: '0.78rem' },
    overlapPx: { xs: 22, md: 34 },
  },
  lg: {
    width: { xs: 158, sm: 178, md: 204 },
    valueFontSize: { xs: '1.85rem', sm: '2.1rem', md: '2.35rem' },
    labelFontSize: { xs: '0.72rem', md: '0.85rem' },
    overlapPx: { xs: 26, md: 38 },
  },
  xl: {
    width: { xs: 182, sm: 202, md: 228 },
    valueFontSize: { xs: '2.1rem', sm: '2.35rem', md: '2.6rem' },
    labelFontSize: { xs: '0.85rem', md: '0.95rem' },
    overlapPx: { xs: 28, md: 42 },
  },
};

interface StatCircleProps {
  value: string;
  label: string;
  background: string;
  size?: StatCircleSize;
  overlap?: boolean;
  zIndex?: number;
}

export const StatCircle = ({
  value,
  label,
  background,
  size = 'md',
  overlap = true,
  zIndex = 1,
}: StatCircleProps) => {
  const config = SIZE_CONFIG[size];

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
        sx={{
          position: 'relative',
          zIndex: 1,
          fontWeight: 700,
          lineHeight: 1.1,
          fontSize: config.valueFontSize,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
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
