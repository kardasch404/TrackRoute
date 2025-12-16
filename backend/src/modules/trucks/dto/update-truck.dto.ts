import { TruckStatus } from '../../../shared/constants/status.constant';

export interface UpdateTruckDto {
  registration?: string;
  brand?: string;
  model?: string;
  year?: number;
  fuelCapacity?: number;
  currentKm?: number;
  status?: TruckStatus;
}
