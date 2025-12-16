export type TripStatus = 'DRAFT' | 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TripLocation {
  address: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Trip {
  _id: string;
  tripNumber: string;
  origin: TripLocation;
  destination: TripLocation;
  distance: number; // in km
  estimatedDuration: number; // in hours
  cargo: {
    description: string;
    weight: number; // in kg
    type: string;
  };
  driver?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  truck?: {
    _id: string;
    registration: string;
    brand: string;
    model: string;
  };
  trailer?: {
    _id: string;
    registration: string;
    type: string;
  };
  status: TripStatus;
  scheduledDate: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
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
  origin: TripLocation;
  destination: TripLocation;
  distance: number;
  estimatedDuration: number;
  scheduledDate: string;
}

export interface CargoDetails {
  description: string;
  weight: number;
  type: string;
  notes?: string;
}

export interface AssignmentDetails {
  driverId?: string;
  truckId?: string;
  trailerId?: string;
}

export interface CreateTripFormData {
  route: RouteDetails;
  cargo: CargoDetails;
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
