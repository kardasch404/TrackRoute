import { useQuery } from '@tanstack/react-query';
import { authApi } from '../services/api';

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.getMe();
      return response.data;
    },
    enabled: !!localStorage.getItem('token'),
  });
};
