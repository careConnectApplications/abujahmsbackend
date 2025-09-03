import crypto from 'crypto';
import redisClient, { isRedisAvailable } from '../redisClient';

// Default TTL for cache (5 minutes)
const DEFAULT_TTL = parseInt(process.env.REDIS_CACHE_TTL || '300');

// Cache key prefixes
const CACHE_KEYS = {
  PATIENT_LIST: 'patients:list',
  PATIENT_DETAIL: 'patients:detail',
  ALL_CACHE_KEYS: 'patients:cache:keys'
};

/**
 * Generate a hash from an object for cache key uniqueness
 */
const generateFilterHash = (filter: any): string => {
  const filterString = JSON.stringify(filter, Object.keys(filter).sort());
  return crypto.createHash('md5').update(filterString).digest('hex');
};

/**
 * Generate cache key for patient list queries
 */
export const generatePatientListCacheKey = (page: number, size: number, filter: any): string => {
  const filterHash = generateFilterHash(filter);
  return `${CACHE_KEYS.PATIENT_LIST}:page_${page}:size_${size}:filter_${filterHash}`;
};

/**
 * Generate cache key for single patient queries
 */
export const generatePatientDetailCacheKey = (patientId: string): string => {
  return `${CACHE_KEYS.PATIENT_DETAIL}:${patientId}`;
};

/**
 * Get data from cache
 */
export const getCachedData = async (key: string): Promise<any | null> => {
  try {
    if (!isRedisAvailable()) {
      console.log('Redis not available, skipping cache read');
      return null;
    }

    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData);
    }
    
    console.log(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

/**
 * Set data in cache with TTL
 */
export const setCachedData = async (key: string, data: any, ttl: number = DEFAULT_TTL): Promise<boolean> => {
  try {
    if (!isRedisAvailable()) {
      console.log('Redis not available, skipping cache write');
      return false;
    }

    await redisClient.setEx(key, ttl, JSON.stringify(data));
    
    // Track this cache key for bulk invalidation
    await redisClient.sAdd(CACHE_KEYS.ALL_CACHE_KEYS, key);
    
    console.log(`Data cached with key: ${key}, TTL: ${ttl}s`);
    return true;
  } catch (error) {
    console.error('Error setting cache:', error);
    return false;
  }
};

/**
 * Invalidate all patient-related cache
 */
export const invalidateAllPatientCache = async (): Promise<boolean> => {
  try {
    if (!isRedisAvailable()) {
      console.log('Redis not available, skipping cache invalidation');
      return false;
    }

    // Get all tracked cache keys
    const cacheKeys = await redisClient.sMembers(CACHE_KEYS.ALL_CACHE_KEYS);
    
    if (cacheKeys.length > 0) {
      // Delete all cache keys
      await redisClient.del(cacheKeys);
      
      // Clear the tracking set
      await redisClient.del(CACHE_KEYS.ALL_CACHE_KEYS);
      
      console.log(`Invalidated ${cacheKeys.length} cache entries`);
    }
    
    return true;
  } catch (error) {
    console.error('Error invalidating cache:', error);
    return false;
  }
};

/**
 * Invalidate specific patient cache
 */
export const invalidatePatientCache = async (patientId: string): Promise<boolean> => {
  try {
    if (!isRedisAvailable()) {
      console.log('Redis not available, skipping cache invalidation');
      return false;
    }

    // Invalidate specific patient detail cache
    const detailKey = generatePatientDetailCacheKey(patientId);
    await redisClient.del(detailKey);
    
    // Also invalidate all list caches as they might contain this patient
    await invalidateAllPatientCache();
    
    console.log(`Invalidated cache for patient: ${patientId}`);
    return true;
  } catch (error) {
    console.error('Error invalidating patient cache:', error);
    return false;
  }
};

/**
 * Cache wrapper for patient list queries
 */
export const cachePatientList = async (
  page: number,
  size: number,
  filter: any,
  fetchFunction: () => Promise<any>
): Promise<any> => {
  const cacheKey = generatePatientListCacheKey(page, size, filter);
  
  // Try to get from cache
  const cachedData = await getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  // Fetch from database
  const data = await fetchFunction();
  
  // Store in cache
  await setCachedData(cacheKey, data);
  
  return data;
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (): Promise<{ totalKeys: number; isConnected: boolean } | null> => {
  try {
    if (!isRedisAvailable()) {
      return { totalKeys: 0, isConnected: false };
    }

    const cacheKeys = await redisClient.sMembers(CACHE_KEYS.ALL_CACHE_KEYS);
    return {
      totalKeys: cacheKeys.length,
      isConnected: true
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
};
