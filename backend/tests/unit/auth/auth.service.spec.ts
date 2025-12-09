import { AuthService } from '../../../src/modules/auth/services/auth.service';
import { IUserRepository } from '../../../src/modules/auth/repositories/user.repository';
import { ValidationException } from '../../../src/shared/exceptions/validation.exception';
import { UnauthorizedException } from '../../../src/shared/exceptions/unauthorized.exception';
import { UserRole } from '../../../src/shared/constants/roles.constant';
import { JwtUtil } from '../../../src/shared/utils/jwt.util';
import { SessionService } from '../../../src/modules/auth/services/session.service';

jest.mock('../../../src/modules/auth/services/session.service');
jest.mock('../../../src/shared/utils/jwt.util');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: jest.Mocked<IUserRepository>;
  let mockSessionService: jest.Mocked<SessionService>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    userRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    mockSessionService = {
      createSession: jest.fn(),
      deleteSession: jest.fn(),
      validateRefreshToken: jest.fn(),
    } as any;

    (SessionService as jest.Mock).mockImplementation(() => mockSessionService);
    (JwtUtil.generateAccessToken as jest.Mock) = jest.fn().mockReturnValue('access-token');
    (JwtUtil.generateRefreshToken as jest.Mock) = jest.fn().mockReturnValue('refresh-token');
    (JwtUtil.verifyToken as jest.Mock) = jest.fn();
    
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('should register user and return tokens', async () => {
      const registerData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.DRIVER,
      };

      const mockUser = {
        _id: '123',
        ...registerData,
        isActive: true,
        comparePassword: jest.fn(),
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser as any);

      const result = await authService.register(registerData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(userRepository.create).toHaveBeenCalledWith(registerData);
      expect(mockSessionService.createSession).toHaveBeenCalledWith('123', 'refresh-token');
      expect(result).toEqual({
        user: {
          id: '123',
          email: registerData.email,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          role: registerData.role,
        },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    });

    it('should throw ValidationException if email exists', async () => {
      const registerData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      userRepository.findByEmail.mockResolvedValue({} as any);

      await expect(authService.register(registerData)).rejects.toThrow(ValidationException);
      await expect(authService.register(registerData)).rejects.toThrow('Email already exists');
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        _id: '123',
        email: loginData.email,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.DRIVER,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser as any);

      const result = await authService.login(loginData);

      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
      expect(mockSessionService.createSession).toHaveBeenCalledWith('123', 'refresh-token');
      expect(result.user.email).toBe(loginData.email);
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const loginData = { email: 'nonexistent@example.com', password: 'password123' };
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedException);
      await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        _id: '123',
        email: loginData.email,
        isActive: false,
        comparePassword: jest.fn(),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser as any);

      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const loginData = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = {
        _id: '123',
        email: loginData.email,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      userRepository.findByEmail.mockResolvedValue(mockUser as any);

      await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedException);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
    });
  });

  describe('logout', () => {
    it('should delete session on logout', async () => {
      await authService.logout('123');

      expect(mockSessionService.deleteSession).toHaveBeenCalledWith('123');
    });
  });

  describe('refreshToken', () => {
    it('should generate new access token with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = { userId: '123', role: UserRole.DRIVER };
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        role: UserRole.DRIVER,
        isActive: true,
      };

      (JwtUtil.verifyToken as jest.Mock).mockReturnValue(mockPayload);
      mockSessionService.validateRefreshToken.mockResolvedValue('123');
      userRepository.findById.mockResolvedValue(mockUser as any);

      const result = await authService.refreshToken(refreshToken);

      expect(JwtUtil.verifyToken).toHaveBeenCalledWith(refreshToken);
      expect(mockSessionService.validateRefreshToken).toHaveBeenCalledWith(refreshToken);
      expect(userRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual({ accessToken: 'access-token' });
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const refreshToken = 'invalid-token';
      (JwtUtil.verifyToken as jest.Mock).mockReturnValue({ userId: '123', role: UserRole.DRIVER });
      mockSessionService.validateRefreshToken.mockResolvedValue(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for mismatched userId', async () => {
      const refreshToken = 'valid-token';
      (JwtUtil.verifyToken as jest.Mock).mockReturnValue({ userId: '123', role: UserRole.DRIVER });
      mockSessionService.validateRefreshToken.mockResolvedValue('456');

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const refreshToken = 'valid-token';
      const mockPayload = { userId: '123', role: UserRole.DRIVER };
      const mockUser = { _id: '123', isActive: false };

      (JwtUtil.verifyToken as jest.Mock).mockReturnValue(mockPayload);
      mockSessionService.validateRefreshToken.mockResolvedValue('123');
      userRepository.findById.mockResolvedValue(mockUser as any);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });
});
