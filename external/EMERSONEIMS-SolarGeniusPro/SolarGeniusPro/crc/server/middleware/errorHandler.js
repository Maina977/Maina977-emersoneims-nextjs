// Global Error Handler Middleware
// Centralized error handling and logging

// errorTracker is an optional add-on (e.g. Sentry / custom logger). Resolve
// it defensively so the middleware loads cleanly even when it isn't wired.
let errorTracker = null;
try {
    ({ errorTracker } = require('../../src/logging/errorTracker'));
} catch {
    // Optional: no external tracker installed.
}
const { logger } = require('../logger');

const errorHandler = {
    // 404 Not Found handler
    notFound: (req, res, next) => {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        error.status = 404;
        next(error);
    },
    
    // Global error handler
    global: (err, req, res, next) => {
        // Log error via structured logger (Winston)
        logger.error(`${err.status || 500}: ${err.message}`, {
            status: err.status || 500,
            url: req.originalUrl,
            method: req.method,
            stack: err.stack,
        });
        
        // Track error for monitoring
        if (errorTracker && typeof errorTracker.track === 'function') {
            errorTracker.track(err, {
                url: req.url,
                method: req.method,
                ip: req.ip,
                userId: req.user?.id
            });
        }
        
        // Determine status code
        const status = err.status || 500;
        
        // Determine error message (don't expose internals in production)
        const message = process.env.NODE_ENV === 'production' && status === 500
            ? 'Internal Server Error'
            : err.message;
        
        res.status(status).json({
            success: false,
            error: message,
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
        });
    },
    
    // Validation error handler
    validation: (err, req, res, next) => {
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                details: err.details || err.message
            });
        }
        next(err);
    },
    
    // JWT error handler
    jwt: (err, req, res, next) => {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        next(err);
    },
    
    // Rate limit error handler
    rateLimit: (err, req, res, next) => {
        if (err.code === 'LIMIT_RATE_LIMIT') {
            return res.status(429).json({
                success: false,
                error: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil(err.resetTime / 1000)
            });
        }
        next(err);
    },
    
    // Database error handler
    database: (err, req, res, next) => {
        if (err.code === 'ER_DUP_ENTRY' || err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: 'Duplicate entry',
                field: err.meta?.target
            });
        }
        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }
        next(err);
    },
    
    // Async handler wrapper
    asyncHandler: (fn) => (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
};

module.exports = errorHandler;