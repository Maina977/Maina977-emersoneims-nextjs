// Structured logger (Winston) with daily rotation-friendly transports.
// Replaces ad-hoc console.log/error across the server.
//
// Levels: error, warn, info, http, debug
// In production, set LOG_LEVEL=info (default). In development LOG_LEVEL=debug.
// All logs are JSON when NODE_ENV=production for easy ingestion (Loki, ELK,
// CloudWatch). In development they are colourised single-line text.

'use strict';

const winston = require('winston');

const isProd = process.env.NODE_ENV === 'production';
const level = process.env.LOG_LEVEL || (isProd ? 'info' : 'debug');

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.printf(({ level: lvl, message, timestamp, ...rest }) => {
    const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
    return `${timestamp} ${lvl} ${message}${meta}`;
  })
);

const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const logger = winston.createLogger({
  level,
  format: isProd ? prodFormat : devFormat,
  defaultMeta: { service: 'solargenius-pro' },
  transports: [new winston.transports.Console({ handleExceptions: true })],
  exitOnError: false,
});

/** Express middleware: log every request once it completes. */
function httpLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    const lvl = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'http';
    logger.log(lvl, `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`, {
      ip: req.ip,
      ua: req.get('user-agent'),
    });
  });
  next();
}

module.exports = { logger, httpLogger };
