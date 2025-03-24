/**
 * @fileoverview Winston logging configuration
 * @module config/winston
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File transport for production
    new DailyRotateFile({
      filename: 'logs/%DATE%-app.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

// Add error handling
logger.exceptions.handle([
  new winston.transports.File({ filename: 'logs/exceptions.log' })
]);

// Add uncaught exception handling
process.on('uncaughtException', (ex) => {
  logger.error('Uncaught Exception was caught', ex);
});

// Add unhandled rejection handling
process.on('unhandledRejection', (ex) => {
  logger.error('Unhandled Rejection was caught', ex);
});

export default logger;
