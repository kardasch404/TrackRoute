import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';
import type { Trip, TripStatus, CreateTripFormData } from '../features/trips/tripsTypes';

interface CreateTripPayload {
  origin: {
    address: string;
    city: string;
    country: string;
  };
  destination: {
    address: string;
    city: string;
    country: string;
  };
  distance: number;
  estimatedDuration: number;
  scheduledDate: string;
  cargo: {
    description: string;
    weight: number;
    type: string;
  };
  notes?: string;
  driverId?: string;
  truckId?: string;
  trailerId?: string;
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

export function useTripMutations() {
  const queryClient = useQueryClient();

  const createTrip = useMutation({
    mutationFn: async (formData: CreateTripFormData) => {
      const payload: CreateTripPayload = {
        origin: formData.route.origin,
        destination: formData.route.destination,
        distance: formData.route.distance,
        estimatedDuration: formData.route.estimatedDuration,
        scheduledDate: formData.route.scheduledDate,
        cargo: {
          description: formData.cargo.description,
          weight: formData.cargo.weight,
          type: formData.cargo.type,
        },
        notes: formData.cargo.notes,
        driverId: formData.assignment.driverId,
        truckId: formData.assignment.truckId,
        trailerId: formData.assignment.trailerId,
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
