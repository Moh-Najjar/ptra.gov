import { useQuery } from '@tanstack/react-query';
import { usersService } from '../../services/usersService';
import { useAuth } from '../useAuth';
import { usersKeys } from './usersKeys';

export const useUsers = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: usersKeys.list,
    queryFn: usersService.getUsers,
    enabled: isAuthenticated,
  });
};
