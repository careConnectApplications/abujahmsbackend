"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRedisAvailable = exports.initializeRedis = void 0;
const redis_1 = require("redis");
// Create Redis client instance
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    },
    password: process.env.REDIS_PASSWORD || undefined,
});
// Redis connection state
let isRedisConnected = true;
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
const initializeRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!redisClient.isOpen) {
            yield redisClient.connect();
        }
        return true;
    }
    catch (error) {
        console.error('Failed to connect to Redis:', error);
        return false;
    }
});
exports.initializeRedis = initializeRedis;
// Check if Redis is connected
const isRedisAvailable = () => {
    return isRedisConnected && redisClient.isOpen;
};
exports.isRedisAvailable = isRedisAvailable;
exports.default = redisClient;
