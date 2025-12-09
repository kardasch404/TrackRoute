import Joi from 'joi';
import { TruckStatus } from '../../../shared/constants/status.constant';

export const updateTruckSchema = Joi.object({
  registration: Joi.string().uppercase().trim(),
  brand: Joi.string().trim(),
  model: Joi.string().trim(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  fuelCapacity: Joi.number().positive(),
  currentKm: Joi.number().min(0),
  status: Joi.string().valid(...Object.values(TruckStatus)),
}).min(1);
