import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { UnauthorizedException } from '../exceptions/unauthorized.exception';
import { UserModel } from '../../database/models/user.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const payload = JwtUtil.verifyToken(token);
    
    // Fetch user with permissions from database
    const user = await UserModel.findById(payload.userId).select('-password');
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    req.user = {
      userId: user._id!.toString(),
      role: user.role,
      permissions: user.permissions || [],
    };
    
    next();
  } catch (error) {
    next(new UnauthorizedException('Invalid or expired token'));
  }
};

export const authenticate = authMiddleware;
