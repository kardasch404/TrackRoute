import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { TRAILER_ENDPOINTS } from '../services/endpoints';
import type { TrailersFilter, TrailersResponse, Trailer } from '../features/trailers/trailersTypes';

export const useTrailers = (filters: TrailersFilter) => {
  return useQuery({
    queryKey: ['trailers', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await apiClient.get<TrailersResponse>(
        `${TRAILER_ENDPOINTS.LIST}?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 30000,
  });
};

export const useTrailer = (id: string | undefined) => {
  return useQuery({
    queryKey: ['trailer', id],
    queryFn: async () => {
      if (!id) throw new Error('Trailer ID is required');
      const response = await apiClient.get<{ success: boolean; data: Trailer }>(
        TRAILER_ENDPOINTS.BY_ID(id)
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};
