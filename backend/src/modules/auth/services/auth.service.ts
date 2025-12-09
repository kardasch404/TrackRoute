import { IUserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '../../../shared/exceptions/unauthorized.exception';
import { ValidationException } from '../../../shared/exceptions/validation.exception';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { SessionService } from './session.service';

export interface IAuthService {
  register(data: RegisterDto): Promise<any>;
  login(data: LoginDto): Promise<any>;
  logout(userId: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<any>;
}

export class AuthService implements IAuthService {
  private sessionService: SessionService;

  constructor(private readonly userRepository: IUserRepository) {
    this.sessionService = new SessionService();
  }

  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationException('Email already exists');
    }

    const user = await this.userRepository.create(data);
    const userId = user._id!.toString();
    const payload = { userId, role: user.role };
    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    await this.sessionService.createSession(userId, refreshToken);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userId = user._id!.toString();
    const payload = { userId, role: user.role };
    const accessToken = JwtUtil.generateAccessToken(payload);
    const refreshToken = JwtUtil.generateRefreshToken(payload);

    await this.sessionService.createSession(userId, refreshToken);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.sessionService.deleteSession(userId);
  }

  async refreshToken(refreshToken: string) {
    const payload = JwtUtil.verifyToken(refreshToken);
    const userId = await this.sessionService.validateRefreshToken(refreshToken);

    if (!userId || userId !== payload.userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }

    const newPayload = { userId: user._id!.toString(), role: user.role };
    const accessToken = JwtUtil.generateAccessToken(newPayload);

    return { accessToken };
  }
}
