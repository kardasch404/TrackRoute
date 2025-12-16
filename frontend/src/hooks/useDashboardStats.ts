import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export interface DashboardStats {
  fleet: {
    trucks: { total: number; available: number; inUse: number; maintenance: number };
    trailers: { total: number; available: number; inUse: number; maintenance: number };
  };
  drivers: { total: number; active: number };
  trips: { planned: number; inProgress: number; completed: number; active: number };
  performance: { totalDistance: number; totalFuelConsumed: number; avgFuelEfficiency: string | number };
  alerts: { total: number; tiresNeedingReplacement: number; vehiclesInMaintenance: number };
}

export interface RecentTrip {
  _id: string;
  code: string;
  driver: string;
  truck: string;
  origin: string;
  destination: string;
  status: string;
  distance: number;
  createdAt: string;
}

export interface FleetOverview {
  trucks: { status: string; count: number }[];
  trailers: { status: string; count: number }[];
}

export interface MaintenanceAlert {
  id: string;
  type: string;
  severity: string;
  message: string;
  vehicle: string;
}

export interface TripStat {
  month: string;
  year: number;
  tripCount: number;
  distance: number;
  fuelConsumed: number;
  completedTrips: number;
}

export interface DriverStat {
  driverId: string;
  name: string;
  tripCount: number;
  totalDistance: number;
  totalFuel: number;
  avgFuelPerTrip: string | number;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data.data;
    },
    refetchInterval: 30000,
  });
};

export const useRecentTrips = (limit = 5) => {
  return useQuery<RecentTrip[]>({
    queryKey: ['dashboard', 'recent-trips', limit],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/recent-trips?limit=${limit}`);
      return response.data.data;
    },
    refetchInterval: 30000,
  });
};

export const useFleetOverview = () => {
  return useQuery<FleetOverview>({
    queryKey: ['dashboard', 'fleet-overview'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/fleet-overview');
      return response.data.data;
    },
    refetchInterval: 30000,
  });
};

export const useMaintenanceAlerts = (limit = 10) => {
  return useQuery<MaintenanceAlert[]>({
    queryKey: ['dashboard', 'maintenance-alerts', limit],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/maintenance-alerts?limit=${limit}`);
      return response.data.data;
    },
    refetchInterval: 60000,
  });
};

export const useTripStats = (months = 6) => {
  return useQuery<TripStat[]>({
    queryKey: ['dashboard', 'trip-stats', months],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/trip-stats?months=${months}`);
      return response.data.data;
    },
    refetchInterval: 60000,
  });
};

export const useDriverStats = (limit = 5) => {
  return useQuery<DriverStat[]>({
    queryKey: ['dashboard', 'driver-stats', limit],
    queryFn: async () => {
      const response = await apiClient.get(`/dashboard/driver-stats?limit=${limit}`);
      return response.data.data;
    },
    refetchInterval: 60000,
  });
};
