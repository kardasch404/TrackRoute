import { JwtPayload } from '../utils/jwt.util';

export interface AuthUser {
  userId: string;
  role: string;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
