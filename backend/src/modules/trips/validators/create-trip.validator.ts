import Joi from 'joi';

export const createTripSchema = Joi.object({
  code: Joi.string().required().uppercase().trim(),
  driver: Joi.string().required(),
  truck: Joi.string().required(),
  trailer: Joi.string(),
  origin: Joi.string().required().trim(),
  destination: Joi.string().required().trim(),
  distance: Joi.number().positive().required(),
  startKm: Joi.number().min(0).required(),
});
