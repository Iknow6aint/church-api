/**
 * @fileoverview Authentication-related errors
 * @module errors/authError
 */

import { BaseError } from './baseError';

export class AuthError extends BaseError {
  constructor(message: string, statusCode: number = 401, details?: Record<string, any>) {
    super(message, statusCode, true, details);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password', 401);
  }
}

export class AdminExistsError extends AuthError {
  constructor(email: string) {
    super(`Admin with email ${email} already exists`, 400);
  }
}

export class AdminNotFoundError extends AuthError {
  constructor(id: string) {
    super(`Admin with ID ${id} not found`, 404);
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('Invalid or expired token', 401);
  }
}

export class PasswordMismatchError extends AuthError {
  constructor() {
    super('Current password is incorrect', 400);
  }
}
