import Joi from 'joi';
import { TripStatus } from '../../../shared/constants/status.constant';

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(TripStatus)).required(),
  endKm: Joi.number().positive().optional(),
  fuelConsumed: Joi.number().positive().optional(),
});
