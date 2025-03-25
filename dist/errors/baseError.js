"use strict";
/**
 * @fileoverview Base error class for custom errors
 * @module errors/baseError
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
class BaseError extends Error {
    constructor(message, statusCode = 500, isOperational = true, details) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            status: 'error',
            code: this.statusCode,
            message: this.message,
            ...(this.details && { details: this.details })
        };
    }
}
exports.BaseError = BaseError;
