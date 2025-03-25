/**
 * @fileoverview Base error class for custom errors
 * @module errors/baseError
 */

export class BaseError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
    public details?: Record<string, any>
  ) {
    super(message);
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
