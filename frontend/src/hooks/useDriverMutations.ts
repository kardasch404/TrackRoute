import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Driver } from '../features/drivers/driversTypes';

interface ApprovalResponse {
  message: string;
  user: Driver;
}

export function useDriverMutations() {
  const queryClient = useQueryClient();

  const approveDriver = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.put<ApprovalResponse>(`/auth/admin/approve-driver/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  const rejectDriver = useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.put<ApprovalResponse>(`/auth/admin/reject-driver/${userId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  return {
    approveDriver,
    rejectDriver,
  };
}
