import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

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
        minWidth: { xs: 140, sm: 160, md: 180 },
        height: { xs: 280, md: 450 },
        borderRadius: 10,
        overflow: 'hidden',
        textDecoration: 'none',
        background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
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
          bottom: 24,
          insetInlineEnd: 16,
          color: '#FFFFFF',
          fontWeight: 700,
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          letterSpacing: 1,
          zIndex: 1,
          p: 1
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};
