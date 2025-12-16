import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Trip, TripStatus, CreateTripFormData } from '../features/trips/tripsTypes';

interface CreateTripPayload {
  code: string;
  driver: string;
  truck: string;
  trailer?: string;
  origin: string;
  destination: string;
  distance: number;
  startKm: number;
}

interface AssignTripPayload {
  tripId: string;
  driverId?: string;
  truckId?: string;
  trailerId?: string;
}

interface UpdateStatusPayload {
  tripId: string;
  status: TripStatus;
}

// Helper function to generate a trip code
function generateTripCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRIP-${timestamp}-${random}`;
}

export function useTripMutations() {
  const queryClient = useQueryClient();

  const createTrip = useMutation({
    mutationFn: async (formData: CreateTripFormData & { startKm: number }) => {
      const payload: CreateTripPayload = {
        code: generateTripCode(),
        driver: formData.assignment.driverId,
        truck: formData.assignment.truckId,
        trailer: formData.assignment.trailerId,
        origin: formData.route.origin,
        destination: formData.route.destination,
        distance: formData.route.distance,
        startKm: formData.startKm,
      };
      
      const { data } = await apiClient.post('/trips', payload);
      return data.data as Trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const updateTrip = useMutation({
    mutationFn: async ({ tripId, ...updates }: { tripId: string } & Partial<CreateTripPayload>) => {
      const { data } = await apiClient.put(`/trips/${tripId}`, updates);
      return data.data as Trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (tripId: string) => {
      await apiClient.delete(`/trips/${tripId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  const assignTrip = useMutation({
    mutationFn: async ({ tripId, ...assignment }: AssignTripPayload) => {
      // Use PUT /trips/:id to update driver/truck/trailer assignment
      const { data } = await apiClient.put(`/trips/${tripId}`, assignment);
      return data.data as Trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['available-drivers'] });
      queryClient.invalidateQueries({ queryKey: ['available-trucks'] });
      queryClient.invalidateQueries({ queryKey: ['available-trailers'] });
    },
  });

  const updateTripStatus = useMutation({
    mutationFn: async ({ tripId, status }: UpdateStatusPayload) => {
      const { data } = await apiClient.put(`/trips/${tripId}/status`, { status });
      return data.data as Trip;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  return {
    createTrip,
    updateTrip,
    deleteTrip,
    assignTrip,
    updateTripStatus,
  };
}
