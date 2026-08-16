import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ROUTES } from '../app/routes/paths';
import { useAuthSession } from '../hooks/useAuthSession';
import { userHasAnyRole } from '../utils/roles';
import type { UserRole } from '../types/roles';

interface RoleGuardProps {
  requiredRoles: readonly UserRole[];
  redirectTo?: string;
}

export const RoleGuard = ({ requiredRoles, redirectTo = ROUTES.HOME }: RoleGuardProps) => {
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!session || !userHasAnyRole(session.user, requiredRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
