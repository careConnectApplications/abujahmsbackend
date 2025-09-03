import { createClient } from 'redis';

// Create Redis client instance
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

// Redis connection state
let isRedisConnected = false;

// Connect to Redis with error handling
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  isRedisConnected = false;
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
  isRedisConnected = true;
});

redisClient.on('ready', () => {
  console.log('Redis Client Ready');
  isRedisConnected = true;
});

// Initialize Redis connection
export const initializeRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    return true;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return false;
  }
};

// Check if Redis is connected
export const isRedisAvailable = () => {
  return isRedisConnected && redisClient.isOpen;
};

export default redisClient;
