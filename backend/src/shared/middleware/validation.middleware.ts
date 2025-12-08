import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ValidationException } from '../exceptions/validation.exception';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new ValidationException(message));
    }
    next();
  };
};
