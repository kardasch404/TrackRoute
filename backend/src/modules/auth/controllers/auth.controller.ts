import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/auth.service';
import { ForbiddenException } from '../../../shared/exceptions/forbidden.exception';
import { UserRole } from '../../../shared/constants/roles.constant';
import { Injectable } from '../../../shared/decorators/injectable';
import { UserModel } from '../../../database/models/user.model';
import { NotFoundException } from '../../../shared/exceptions/not-found.exception';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Public registration for drivers - they will be pending approval
      const result = await this.authService.register(req.body);
      res.status(201).json({ success: true, message: 'Registration successful. Please wait for admin approval.', data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({ success: true, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      await this.authService.logout(userId);
      res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refreshToken(refreshToken);
      res.status(200).json({ success: true, message: 'Token refreshed', data: result });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        throw new ForbiddenException('Not authenticated');
      }

      const user = await UserModel.findById(userId).select('-password');
      if (!user) {
        throw new NotFoundException('User not found');
      }

      res.status(200).json({ 
        success: true, 
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          status: user.status,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
