import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Trip } from '../features/trips/tripsTypes';

// Get my trips (for drivers)
export function useMyTrips() {
  return useQuery<Trip[]>({
    queryKey: ['my-trips'],
    queryFn: async () => {
      const { data } = await apiClient.get('/trips/my-trips');
      return data.data;
    },
  });
}

// Get driver dashboard stats
export function useDriverStats() {
  return useQuery({
    queryKey: ['driver-stats'],
    queryFn: async () => {
      const { data } = await apiClient.get('/trips/my-trips');
      const trips: Trip[] = data.data || [];
      
      const planned = trips.filter(t => t.status === 'PLANNED').length;
      const inProgress = trips.filter(t => t.status === 'IN_PROGRESS').length;
      const completed = trips.filter(t => t.status === 'COMPLETED').length;
      const totalDistance = trips.reduce((sum, t) => sum + (t.distance || 0), 0);
      
      // Get current trip (in progress)
      const currentTrip = trips.find(t => t.status === 'IN_PROGRESS');
      
      // Get next planned trip
      const nextTrip = trips.find(t => t.status === 'PLANNED');
      
      return {
        planned,
        inProgress,
        completed,
        totalTrips: trips.length,
        totalDistance,
        currentTrip,
        nextTrip,
        recentTrips: trips.slice(0, 5),
      };
    },
    refetchInterval: 30000,
  });
}

// Trip mutations for drivers
export function useTripMutations() {
  const queryClient = useQueryClient();

  const startTrip = useMutation({
    mutationFn: async (tripId: string) => {
      const { data } = await apiClient.put(`/trips/${tripId}/status`, { status: 'IN_PROGRESS' });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      queryClient.invalidateQueries({ queryKey: ['driver-stats'] });
    },
  });

  const completeTrip = useMutation({
    mutationFn: async ({ tripId, endKm, fuelConsumed }: { tripId: string; endKm: number; fuelConsumed?: number }) => {
      console.log('API call - completing trip:', { tripId, status: 'COMPLETED', endKm, fuelConsumed });
      const { data } = await apiClient.put(`/trips/${tripId}/status`, { 
        status: 'COMPLETED',
        endKm,
        fuelConsumed,
      });
      console.log('API response:', data);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-trips'] });
      queryClient.invalidateQueries({ queryKey: ['driver-stats'] });
    },
  });

  return { startTrip, completeTrip };
}
