import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    },
    refetchInterval: 30000,
  });
};
