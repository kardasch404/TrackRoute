import { TireStatus, VehicleType } from '../../../shared/constants/status.constant';

export interface ITire {
  _id?: string;
  vehicle: string;
  vehicleType: VehicleType;
  position: string;
  brand: string;
  installKm: number;
  currentKm: number;
  maxLifeKm: number;
  status: TireStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
