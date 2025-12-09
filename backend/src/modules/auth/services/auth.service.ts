import jwt from 'jsonwebtoken';
import { IUserRepository } from '../repositories/user.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UnauthorizedException } from '../../../shared/exceptions/unauthorized.exception';
import { ValidationException } from '../../../shared/exceptions/validation.exception';

export interface IAuthService {
  register(data: RegisterDto): Promise<any>;
  login(data: LoginDto): Promise<any>;
}

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationException('Email already exists');
    }

    const user = await this.userRepository.create(data);
    const token = this.generateToken(user._id.toString(), user.role);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
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

    const token = this.generateToken(user._id.toString(), user.role);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(userId: string, role: string): string {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}
