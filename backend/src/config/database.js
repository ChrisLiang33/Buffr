import mongoose from 'mongoose';
import Redis from 'redis';
import { logger } from '../utils/logger.js';

// MongoDB connection
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    });

    logger.info(`📦 MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Redis connection
let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis server refused connection');
          return new Error('Redis server refused connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          logger.error('Redis max retry attempts reached');
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      },
    });

    redisClient.on('connect', () => {
      logger.info('📦 Redis Connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    redisClient.on('end', () => {
      logger.warn('Redis connection ended');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    return null;
  }
};

export const getRedisClient = () => {
  return redisClient;
};

// Database utilities
export const clearCache = async (pattern = '*') => {
  if (!redisClient) return;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cleared ${keys.length} cache entries with pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Error clearing cache:', error);
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  if (!redisClient) return;
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error('Error setting cache:', error);
  }
};

export const getCache = async (key) => {
  if (!redisClient) return null;
  
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Error getting cache:', error);
    return null;
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return;
  
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Error deleting cache:', error);
  }
};

// Database health check
export const checkDatabaseHealth = async () => {
  const health = {
    mongodb: false,
    redis: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      health.mongodb = true;
    }

    // Check Redis
    if (redisClient && redisClient.isReady) {
      health.redis = true;
    }

    return health;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return health;
  }
}; 