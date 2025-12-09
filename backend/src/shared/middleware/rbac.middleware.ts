import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles.constant';
import { ForbiddenException } from '../exceptions/forbidden.exception';

export const hasRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenException('User not authenticated'));
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return next(new ForbiddenException('Insufficient permissions'));
    }

    next();
  };
};

export const isAdmin = hasRole(UserRole.ADMIN);
export const isDriver = hasRole(UserRole.DRIVER);
export const isAdminOrDriver = hasRole(UserRole.ADMIN, UserRole.DRIVER);
