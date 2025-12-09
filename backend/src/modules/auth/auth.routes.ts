import { Router } from 'express';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from './repositories/user.repository';
import { validate } from '../../shared/middleware/validation.middleware';
import { registerSchema } from './validators/register.validator';
import { loginSchema } from './validators/login.validator';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;
