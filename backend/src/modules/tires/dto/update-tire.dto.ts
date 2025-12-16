import { TireStatus } from '../../../shared/constants/status.constant';

export interface UpdateTireDto {
  position?: string;
  brand?: string;
  currentKm?: number;
  maxLifeKm?: number;
  status?: TireStatus;
}
