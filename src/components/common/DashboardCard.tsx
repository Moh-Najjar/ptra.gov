import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { rem } from '../../theme/rem';

interface DashboardCardProps {
  label: string;
  path: string;
  background: string;
}

export const DashboardCard = ({ label, path, background }: DashboardCardProps) => {
  return (
    <Box
      component={RouterLink}
      to={path}
      sx={{
        position: 'relative',
        display: 'block',
        flex: 1,
        minWidth: { xs: rem(140), sm: rem(160), md: rem(180) },
        height: { xs: rem(280), md: rem(450) },
        borderRadius: 10,
        overflow: 'hidden',
        textDecoration: 'none',
        background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-0.25rem)',
          boxShadow: 6,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.28) 0%, rgba(0,0,0,0.2) 100%)',
        },
      }}
    >
      <Typography
        variant="h3"
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
          p: 1
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};
