import Joi from 'joi';
import { TrailerStatus } from '../../../shared/constants/status.constant';

export const createTrailerSchema = Joi.object({
  registration: Joi.string().required().uppercase().trim(),
  type: Joi.string().required().trim(),
  capacity: Joi.number().positive().required(),
  currentKm: Joi.number().min(0).default(0),
  status: Joi.string().valid(...Object.values(TrailerStatus)).default(TrailerStatus.AVAILABLE),
});
