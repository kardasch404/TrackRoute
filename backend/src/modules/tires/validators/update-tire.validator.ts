import Joi from 'joi';
import { TireStatus } from '../../../shared/constants/status.constant';

export const updateTireSchema = Joi.object({
  position: Joi.string().trim(),
  brand: Joi.string().trim(),
  currentKm: Joi.number().min(0),
  maxLifeKm: Joi.number().positive(),
  status: Joi.string().valid(...Object.values(TireStatus)),
}).min(1);
