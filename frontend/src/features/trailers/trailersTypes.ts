export type TrailerStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export interface Trailer {
  _id: string;
  registration: string;
  type: string;
  capacity: number;
  currentKm: number;
  status: TrailerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TrailerFormData {
  registration: string;
  type: string;
  capacity: number;
  currentKm?: number;
  status?: TrailerStatus;
}

export interface TrailersFilter {
  status?: TrailerStatus | '';
  search?: string;
  page: number;
  limit: number;
}

export interface TrailersResponse {
  success: boolean;
  data: Trailer[];
}

export interface TrailerResponse {
  success: boolean;
  data: Trailer;
}

export type FilterAction =
  | { type: 'SET_STATUS'; payload: TrailerStatus | '' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET' };
