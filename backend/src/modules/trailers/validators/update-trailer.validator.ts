import Joi from 'joi';
import { TrailerStatus } from '../../../shared/constants/status.constant';

export const updateTrailerSchema = Joi.object({
  registration: Joi.string().uppercase().trim(),
  type: Joi.string().trim(),
  capacity: Joi.number().positive(),
  currentKm: Joi.number().min(0),
  status: Joi.string().valid(...Object.values(TrailerStatus)),
}).min(1);
