import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions/base.exception';
import logger from '../utils/logger.util';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseException) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${err.stack}`);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    statusCode: 500,
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404,
  });
};
