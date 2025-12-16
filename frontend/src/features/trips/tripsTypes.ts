export type TripStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  _id: string;
  code: string;
  origin: string;
  destination: string;
  distance: number; // in km
  startKm: number;
  endKm?: number;
  fuelConsumed?: number;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  truck: {
    _id: string;
    registration: string;
    brand: string;
    model: string;
    currentKm: number;
  };
  trailer?: {
    _id: string;
    registration: string;
    type: string;
  };
  status: TripStatus;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripFilters {
  status?: TripStatus | '';
  search?: string;
  startDate?: string;
  endDate?: string;
  driverId?: string;
}

// Form Types for Multi-step creation
export interface RouteDetails {
  origin: string;
  destination: string;
  distance: number;
}

export interface AssignmentDetails {
  driverId: string;
  truckId: string;
  trailerId?: string;
}

export interface CreateTripFormData {
  route: RouteDetails;
  assignment: AssignmentDetails;
}

// API Response Types
export interface TripsResponse {
  success: boolean;
  data: Trip[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TripResponse {
  success: boolean;
  data: Trip;
}
