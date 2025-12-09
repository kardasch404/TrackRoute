import Joi from 'joi';
import { TireStatus, VehicleType } from '../../../shared/constants/status.constant';

export const createTireSchema = Joi.object({
  vehicle: Joi.string().required(),
  vehicleType: Joi.string().valid(...Object.values(VehicleType)).required(),
  position: Joi.string().required().trim(),
  brand: Joi.string().required().trim(),
  installKm: Joi.number().min(0).required(),
  currentKm: Joi.number().min(0).required(),
  maxLifeKm: Joi.number().positive().required(),
  status: Joi.string().valid(...Object.values(TireStatus)).default(TireStatus.GOOD),
});
