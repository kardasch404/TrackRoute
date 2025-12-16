import { TireStatus, VehicleType } from '../../../shared/constants/status.constant';

export interface CreateTireDto {
  vehicle: string;
  vehicleType: VehicleType;
  position: string;
  brand: string;
  installKm: number;
  currentKm: number;
  maxLifeKm: number;
  status?: TireStatus;
}
