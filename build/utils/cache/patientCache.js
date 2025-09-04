"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheStats = exports.cachePatientList = exports.invalidatePatientCache = exports.invalidateAllPatientCache = exports.setCachedData = exports.getCachedData = exports.generatePatientDetailCacheKey = exports.generatePatientListCacheKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redisClient_1 = __importStar(require("../redisClient"));
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
const generateFilterHash = (filter) => {
    const filterString = JSON.stringify(filter, Object.keys(filter).sort());
    return crypto_1.default.createHash('md5').update(filterString).digest('hex');
};
/**
 * Generate cache key for patient list queries
 */
const generatePatientListCacheKey = (page, size, filter) => {
    const filterHash = generateFilterHash(filter);
    return `${CACHE_KEYS.PATIENT_LIST}:page_${page}:size_${size}:filter_${filterHash}`;
};
exports.generatePatientListCacheKey = generatePatientListCacheKey;
/**
 * Generate cache key for single patient queries
 */
const generatePatientDetailCacheKey = (patientId) => {
    return `${CACHE_KEYS.PATIENT_DETAIL}:${patientId}`;
};
exports.generatePatientDetailCacheKey = generatePatientDetailCacheKey;
/**
 * Get data from cache
 */
const getCachedData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, redisClient_1.isRedisAvailable)()) {
            console.log('Redis not available, skipping cache read');
            return null;
        }
        const cachedData = yield redisClient_1.default.get(key);
        if (cachedData) {
            console.log(`Cache hit for key: ${key}`);
            return JSON.parse(cachedData);
        }
        console.log(`Cache miss for key: ${key}`);
        return null;
    }
    catch (error) {
        console.error('Error reading from cache:', error);
        return null;
    }
});
exports.getCachedData = getCachedData;
/**
 * Set data in cache with TTL
 */
const setCachedData = (key_1, data_1, ...args_1) => __awaiter(void 0, [key_1, data_1, ...args_1], void 0, function* (key, data, ttl = DEFAULT_TTL) {
    try {
        if (!(0, redisClient_1.isRedisAvailable)()) {
            console.log('Redis not available, skipping cache write');
            return false;
        }
        yield redisClient_1.default.setEx(key, ttl, JSON.stringify(data));
        // Track this cache key for bulk invalidation
        yield redisClient_1.default.sAdd(CACHE_KEYS.ALL_CACHE_KEYS, key);
        console.log(`Data cached with key: ${key}, TTL: ${ttl}s`);
        return true;
    }
    catch (error) {
        console.error('Error setting cache:', error);
        return false;
    }
});
exports.setCachedData = setCachedData;
/**
 * Invalidate all patient-related cache
 */
const invalidateAllPatientCache = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, redisClient_1.isRedisAvailable)()) {
            console.log('Redis not available, skipping cache invalidation');
            return false;
        }
        // Get all tracked cache keys
        const cacheKeys = yield redisClient_1.default.sMembers(CACHE_KEYS.ALL_CACHE_KEYS);
        if (cacheKeys.length > 0) {
            // Delete all cache keys
            yield redisClient_1.default.del(cacheKeys);
            // Clear the tracking set
            yield redisClient_1.default.del(CACHE_KEYS.ALL_CACHE_KEYS);
            console.log(`Invalidated ${cacheKeys.length} cache entries`);
        }
        return true;
    }
    catch (error) {
        console.error('Error invalidating cache:', error);
        return false;
    }
});
exports.invalidateAllPatientCache = invalidateAllPatientCache;
/**
 * Invalidate specific patient cache
 */
const invalidatePatientCache = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, redisClient_1.isRedisAvailable)()) {
            console.log('Redis not available, skipping cache invalidation');
            return false;
        }
        // Invalidate specific patient detail cache
        const detailKey = (0, exports.generatePatientDetailCacheKey)(patientId);
        yield redisClient_1.default.del(detailKey);
        // Also invalidate all list caches as they might contain this patient
        yield (0, exports.invalidateAllPatientCache)();
        console.log(`Invalidated cache for patient: ${patientId}`);
        return true;
    }
    catch (error) {
        console.error('Error invalidating patient cache:', error);
        return false;
    }
});
exports.invalidatePatientCache = invalidatePatientCache;
/**
 * Cache wrapper for patient list queries
 */
const cachePatientList = (page, size, filter, fetchFunction) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheKey = (0, exports.generatePatientListCacheKey)(page, size, filter);
    // Try to get from cache
    const cachedData = yield (0, exports.getCachedData)(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    // Fetch from database
    const data = yield fetchFunction();
    // Store in cache
    yield (0, exports.setCachedData)(cacheKey, data);
    return data;
});
exports.cachePatientList = cachePatientList;
/**
 * Get cache statistics
 */
const getCacheStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, redisClient_1.isRedisAvailable)()) {
            return { totalKeys: 0, isConnected: false };
        }
        const cacheKeys = yield redisClient_1.default.sMembers(CACHE_KEYS.ALL_CACHE_KEYS);
        return {
            totalKeys: cacheKeys.length,
            isConnected: true
        };
    }
    catch (error) {
        console.error('Error getting cache stats:', error);
        return null;
    }
});
exports.getCacheStats = getCacheStats;
