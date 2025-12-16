import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { TRUCK_ENDPOINTS } from '../services/endpoints';
import type { TrucksFilter, TrucksResponse, Truck } from '../features/trucks/trucksTypes';

export const useTrucks = (filters: TrucksFilter) => {
  return useQuery({
    queryKey: ['trucks', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await apiClient.get<TrucksResponse>(
        `${TRUCK_ENDPOINTS.LIST}?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
};

export const useTruck = (id: string | undefined) => {
  return useQuery({
    queryKey: ['truck', id],
    queryFn: async () => {
      if (!id) throw new Error('Truck ID is required');
      const response = await apiClient.get<{ success: boolean; data: Truck }>(
        TRUCK_ENDPOINTS.BY_ID(id)
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};
