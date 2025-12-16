import { TruckStatus } from '../../../shared/constants/status.constant';

export interface ITruck {
  _id?: string;
  registration: string;
  brand: string;
  model: string;
  year: number;
  fuelCapacity: number;
  currentKm: number;
  status: TruckStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
