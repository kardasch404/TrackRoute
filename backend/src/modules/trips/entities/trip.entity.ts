import { TripStatus } from '../../../shared/constants/status.constant';

export interface ITrip {
  _id?: string;
  code: string;
  driver: string;
  truck: string;
  trailer?: string;
  origin: string;
  destination: string;
  distance: number;
  startKm: number;
  endKm?: number;
  fuelConsumed?: number;
  status: TripStatus;
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
