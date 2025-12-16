import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import { TRUCK_ENDPOINTS } from '../services/endpoints';
import type { TruckFormData, Truck } from '../features/trucks/trucksTypes';

export const useCreateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TruckFormData) => {
      const response = await apiClient.post<{ success: boolean; data: Truck }>(
        TRUCK_ENDPOINTS.CREATE,
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
  });
};

export const useUpdateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TruckFormData> }) => {
      const response = await apiClient.put<{ success: boolean; data: Truck }>(
        TRUCK_ENDPOINTS.BY_ID(id),
        data
      );
      return response.data.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['trucks'] });
      await queryClient.cancelQueries({ queryKey: ['truck', id] });

      // Snapshot the previous value
      const previousTruck = queryClient.getQueryData(['truck', id]);

      // Optimistically update
      queryClient.setQueryData(['truck', id], (old: Truck | undefined) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      return { previousTruck };
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousTruck) {
        queryClient.setQueryData(['truck', id], context.previousTruck);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
  });
};

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(TRUCK_ENDPOINTS.BY_ID(id));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trucks'] });
    },
  });
};
