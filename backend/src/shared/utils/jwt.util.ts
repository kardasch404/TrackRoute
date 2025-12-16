import jwt from 'jsonwebtoken';
import { config } from '../../config/env.config';

export interface JwtPayload {
  userId: string;
  role: string;
}

export class JwtUtil {
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  }
}
