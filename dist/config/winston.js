"use strict";
/**
 * @fileoverview Winston logging configuration
 * @module config/winston
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
// Create a logger instance
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        // Console transport for development
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        }),
        // File transport for production
        new winston_daily_rotate_file_1.default({
            filename: 'logs/%DATE%-app.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // Exception handler transport
        new winston_1.default.transports.File({ filename: 'logs/exceptions.log' })
    ]
});
// Add uncaught exception handling
process.on('uncaughtException', (ex) => {
    logger.error('Uncaught Exception was caught', ex);
});
// Add unhandled rejection handling
process.on('unhandledRejection', (ex) => {
    logger.error('Unhandled Rejection was caught', ex);
});
exports.default = logger;
