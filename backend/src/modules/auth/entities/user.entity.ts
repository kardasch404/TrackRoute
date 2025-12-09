import { UserRole } from '../../../shared/constants/roles.constant';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  permissions?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
