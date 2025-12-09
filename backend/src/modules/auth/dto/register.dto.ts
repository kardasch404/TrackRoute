import { UserRole } from '../../../shared/constants/roles.constant';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}
