import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ROUTES } from '../app/routes/paths';
import { useAuthSession } from '../hooks/queries/useAuthSession';

interface AuthGuardProps {
  redirectTo?: string;
}

export const AuthGuard = ({ redirectTo = ROUTES.HOME }: AuthGuardProps) => {
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
