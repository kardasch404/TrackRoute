import { RedisClient } from '../../../config/redis.config';

export class SessionService {
  private redis = RedisClient.getInstance();
  private readonly SESSION_PREFIX = 'session:';
  private readonly REFRESH_TOKEN_PREFIX = 'refresh:';

  async createSession(userId: string, refreshToken: string): Promise<void> {
    await this.redis.setex(`${this.SESSION_PREFIX}${userId}`, 604800, refreshToken);
    await this.redis.setex(`${this.REFRESH_TOKEN_PREFIX}${refreshToken}`, 604800, userId);
  }

  async getSession(userId: string): Promise<string | null> {
    return this.redis.get(`${this.SESSION_PREFIX}${userId}`);
  }

  async validateRefreshToken(refreshToken: string): Promise<string | null> {
    return this.redis.get(`${this.REFRESH_TOKEN_PREFIX}${refreshToken}`);
  }

  async deleteSession(userId: string): Promise<void> {
    const refreshToken = await this.redis.get(`${this.SESSION_PREFIX}${userId}`);
    if (refreshToken) {
      await this.redis.del(`${this.REFRESH_TOKEN_PREFIX}${refreshToken}`);
    }
    await this.redis.del(`${this.SESSION_PREFIX}${userId}`);
  }
}
