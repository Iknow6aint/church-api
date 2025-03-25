"use strict";
/**
 * @fileoverview Authentication-related errors
 * @module errors/authError
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordMismatchError = exports.InvalidTokenError = exports.AdminNotFoundError = exports.AdminExistsError = exports.InvalidCredentialsError = exports.AuthError = void 0;
const baseError_1 = require("./baseError");
class AuthError extends baseError_1.BaseError {
    constructor(message, statusCode = 401, details) {
        super(message, statusCode, true, details);
    }
}
exports.AuthError = AuthError;
class InvalidCredentialsError extends AuthError {
    constructor() {
        super('Invalid email or password', 401);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class AdminExistsError extends AuthError {
    constructor(email) {
        super(`Admin with email ${email} already exists`, 400);
    }
}
exports.AdminExistsError = AdminExistsError;
class AdminNotFoundError extends AuthError {
    constructor(id) {
        super(`Admin with ID ${id} not found`, 404);
    }
}
exports.AdminNotFoundError = AdminNotFoundError;
class InvalidTokenError extends AuthError {
    constructor() {
        super('Invalid or expired token', 401);
    }
}
exports.InvalidTokenError = InvalidTokenError;
class PasswordMismatchError extends AuthError {
    constructor() {
        super('Current password is incorrect', 400);
    }
}
exports.PasswordMismatchError = PasswordMismatchError;
