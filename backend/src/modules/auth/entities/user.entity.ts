import { UserRole } from '../../../shared/constants/roles.constant';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: Date;
  updatedAt?: Date;
}
