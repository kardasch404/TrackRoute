import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { TripFilters, TripsResponse, TripResponse } from '../features/trips/tripsTypes';

export function useTrips(filters?: TripFilters) {
  return useQuery({
    queryKey: ['trips', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.driverId) params.append('driverId', filters.driverId);

      const { data } = await apiClient.get<TripsResponse>(`/trips?${params.toString()}`);
      return data.data;
    },
  });
}

export function useTrip(tripId: string | undefined) {
  return useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      if (!tripId) return null;
      const { data } = await apiClient.get<TripResponse>(`/trips/${tripId}`);
      return data.data;
    },
    enabled: !!tripId,
  });
}

export function useAvailableDrivers() {
  return useQuery({
    queryKey: ['available-drivers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/admin/drivers?status=APPROVED');
      return data.data;
    },
  });
}

export function useAvailableTrucks() {
  return useQuery({
    queryKey: ['available-trucks'],
    queryFn: async () => {
      const { data } = await apiClient.get('/trucks?status=AVAILABLE');
      return data.data;
    },
  });
}

export function useAvailableTrailers() {
  return useQuery({
    queryKey: ['available-trailers'],
    queryFn: async () => {
      const { data } = await apiClient.get('/trailers?status=AVAILABLE');
      return data.data;
    },
  });
}
