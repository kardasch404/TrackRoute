import Redis from 'ioredis';
import { config } from './env.config';
import logger from '../shared/utils/logger.util';

export class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.redis.url);
      
      RedisClient.instance.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      RedisClient.instance.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });
    }
    return RedisClient.instance;
  }

  public static async disconnect(): Promise<void> {
    if (RedisClient.instance) {
      await RedisClient.instance.quit();
      logger.info('Redis disconnected');
    }
  }
}
