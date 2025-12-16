import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { TRAILER_ENDPOINTS } from '../services/endpoints';
import type { TrailerFormData, Trailer } from '../features/trailers/trailersTypes';

export const useCreateTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TrailerFormData) => {
      const response = await apiClient.post<{ success: boolean; data: Trailer }>(
        TRAILER_ENDPOINTS.CREATE,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};

export const useUpdateTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TrailerFormData> }) => {
      const response = await apiClient.put<{ success: boolean; data: Trailer }>(
        TRAILER_ENDPOINTS.BY_ID(id),
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
      queryClient.invalidateQueries({ queryKey: ['trailer', variables.id] });
    },
  });
};

export const useDeleteTrailer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(TRAILER_ENDPOINTS.BY_ID(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trailers'] });
    },
  });
};
