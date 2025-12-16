import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Driver, DriverFilters } from '../features/drivers/driversTypes';

interface DriversResponse {
  success: boolean;
  data: Driver[];
}

export function usePendingDrivers() {
  return useQuery({
    queryKey: ['drivers', 'pending'],
    queryFn: async () => {
      const { data } = await apiClient.get<Driver[]>('/auth/admin/pending-drivers');
      return data;
    },
  });
}

export function useAllDrivers(filters?: DriverFilters) {
  return useQuery({
    queryKey: ['drivers', 'all', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<DriversResponse>('/users', {
        params: { role: 'DRIVER', ...filters },
      });
      return data.data;
    },
  });
}
