import Joi from 'joi';
import { UserRole } from '../../../shared/constants/roles.constant';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export const registerSchema = Joi.object<RegisterDto>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  role: Joi.string().valid(...Object.values(UserRole)).optional(),
});
