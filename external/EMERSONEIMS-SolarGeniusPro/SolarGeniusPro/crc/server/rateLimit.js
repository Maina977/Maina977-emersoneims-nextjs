// Rate Limiting Middleware
// Prevents API abuse and DDoS attacks

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        success: false,
        error: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:api:'
    })
});

// Strict rate limiter for sensitive endpoints
const strictLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: {
        success: false,
        error: 'Rate limit exceeded. Please slow down.'
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:strict:'
    })
});

// Login rate limiter (prevent brute force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    skipSuccessfulRequests: true,
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes.'
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:login:'
    })
});

// Registration rate limiter
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour
    message: {
        success: false,
        error: 'Too many registration attempts. Please try again later.'
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:register:'
    })
});

// Password reset rate limiter
const resetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 reset requests per hour
    message: {
        success: false,
        error: 'Too many password reset attempts. Please try again later.'
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:reset:'
    })
});

// IP-based rate limiter for anonymous requests
const ipLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute per IP
    keyGenerator: (req) => req.ip,
    message: {
        success: false,
        error: 'Too many requests from this IP.'
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
        prefix: 'rl:ip:'
    })
});

// User-based rate limiter
const userLimiter = (maxRequests = 100, windowMs = 60000) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        keyGenerator: (req) => req.user?.id || req.ip,
        message: {
            success: false,
            error: 'Rate limit exceeded for this user.'
        },
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
            prefix: 'rl:user:'
        })
    });
};

// Endpoint-specific limiters
const limiters = {
    api: apiLimiter,
    strict: strictLimiter,
    login: loginLimiter,
    register: registerLimiter,
    reset: resetLimiter,
    ip: ipLimiter,
    user: userLimiter
};

module.exports = limiters;