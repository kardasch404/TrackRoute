export type TruckStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export interface Truck {
  _id: string;
  registration: string;
  brand: string;
  model: string;
  year: number;
  fuelCapacity: number;
  currentKm: number;
  status: TruckStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TruckFormData {
  registration: string;
  brand: string;
  model: string;
  year: number;
  fuelCapacity: number;
  currentKm?: number;
  status?: TruckStatus;
}

export interface TrucksFilter {
  status?: TruckStatus | '';
  search?: string;
  page: number;
  limit: number;
}

export interface TrucksResponse {
  success: boolean;
  data: Truck[];
}

export interface TruckResponse {
  success: boolean;
  data: Truck;
}

export type FilterAction =
  | { type: 'SET_STATUS'; payload: TruckStatus | '' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET' };
