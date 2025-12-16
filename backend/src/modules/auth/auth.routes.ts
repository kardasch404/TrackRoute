import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { AdminController } from './controllers/admin.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { validate } from '../../shared/middleware/validation.middleware';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { registerSchema } from './validators/register.validator';
import { loginSchema } from './validators/login.validator';
import { refreshTokenSchema } from './validators/refresh-token.validator';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const adminController = new AdminController();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getMe);

// Admin routes - driver management
router.get('/admin/drivers', authenticate, adminController.getAllDrivers);
router.get('/admin/pending-drivers', authenticate, adminController.getPendingDrivers);
router.put('/admin/approve-driver/:userId', authenticate, adminController.approveDriver);
router.put('/admin/reject-driver/:userId', authenticate, adminController.rejectDriver);
router.patch('/admin/driver/:userId/status', authenticate, adminController.updateDriverStatus);

export default router;
