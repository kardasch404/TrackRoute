import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = JwtUtil.verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedException('Invalid or expired token'));
  }
};
