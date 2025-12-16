import { TrailerStatus } from '../../../shared/constants/status.constant';

export interface CreateTrailerDto {
  registration: string;
  type: string;
  capacity: number;
  currentKm?: number;
  status?: TrailerStatus;
}
