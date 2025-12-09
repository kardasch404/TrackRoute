import Joi from 'joi';
import { TruckStatus } from '../../../shared/constants/status.constant';

export const createTruckSchema = Joi.object({
  registration: Joi.string().required().uppercase().trim(),
  brand: Joi.string().required().trim(),
  model: Joi.string().required().trim(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  fuelCapacity: Joi.number().positive().required(),
  currentKm: Joi.number().min(0).default(0),
  status: Joi.string().valid(...Object.values(TruckStatus)).default(TruckStatus.AVAILABLE),
});
