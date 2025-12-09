import { TrailerStatus } from '../../../shared/constants/status.constant';

export interface ITrailer {
  _id?: string;
  registration: string;
  type: string;
  capacity: number;
  currentKm: number;
  status: TrailerStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
