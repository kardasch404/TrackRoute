import Joi from 'joi';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from '../../../shared/constants/roles.constant';

export const registerSchema = Joi.object<RegisterDto>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  role: Joi.string().valid(...Object.values(UserRole)).default(UserRole.DRIVER),
});
