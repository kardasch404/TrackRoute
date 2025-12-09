import { TrailerStatus } from '../../../shared/constants/status.constant';

export interface UpdateTrailerDto {
  registration?: string;
  type?: string;
  capacity?: number;
  currentKm?: number;
  status?: TrailerStatus;
}
