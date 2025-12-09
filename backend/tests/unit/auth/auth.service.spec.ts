import { AuthService } from '../../../src/modules/auth/services/auth.service';
import { IUserRepository } from '../../../src/modules/auth/repositories/user.repository';
import { ValidationException } from '../../../src/shared/exceptions/validation.exception';
import { UnauthorizedException } from '../../../src/shared/exceptions/unauthorized.exception';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('should throw error if email exists', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      userRepository.findByEmail.mockResolvedValue({} as any);

      await expect(authService.register(registerData)).rejects.toThrow(ValidationException);
    });
  });

  describe('login', () => {
    it('should throw error for invalid credentials', async () => {
      const loginData = { email: 'test@example.com', password: 'wrong' };

      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedException);
    });
  });
});
