"use strict";
/**
 * @fileoverview Authentication controller with custom error handling
 * @module controllers/authController
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const winston_1 = __importDefault(require("../config/winston"));
const baseError_1 = require("../errors/baseError");
class AuthController {
    constructor() { }
    async signup(req, res) {
        try {
            const { name, email, password } = req.body;
            winston_1.default.info('Signup attempt', { email });
            const result = await authService_1.authService.signup({
                name,
                email,
                password
            });
            winston_1.default.info('Signup successful', { email });
            res.status(201).json(result);
        }
        catch (error) {
            winston_1.default.error('Signup failed', {
                email: req.body.email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            if (error instanceof baseError_1.BaseError) {
                res.status(error.statusCode).json(error.toJSON());
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 500,
                message: 'An unexpected error occurred'
            });
        }
    }
    async signin(req, res) {
        try {
            const { email } = req.body;
            winston_1.default.info('Signin attempt', { email });
            const result = await authService_1.authService.signin(email, req.body.password);
            winston_1.default.info('Signin successful', { email });
            res.json(result);
        }
        catch (error) {
            winston_1.default.error('Signin failed', {
                email: req.body.email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            if (error instanceof baseError_1.BaseError) {
                res.status(error.statusCode).json(error.toJSON());
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 500,
                message: 'An unexpected error occurred'
            });
        }
    }
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const adminId = req.admin?.adminId;
            if (!adminId) {
                winston_1.default.warn('Unauthorized password change attempt');
                res.status(401).json({
                    status: 'error',
                    code: 401,
                    message: 'Unauthorized'
                });
                return;
            }
            winston_1.default.info('Password change attempt', { adminId });
            const result = await authService_1.authService.changePassword(adminId, currentPassword, newPassword);
            winston_1.default.info('Password changed successfully', { adminId });
            res.json(result);
        }
        catch (error) {
            winston_1.default.error('Password change failed', {
                adminId: req.admin?.adminId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            if (error instanceof baseError_1.BaseError) {
                res.status(error.statusCode).json(error.toJSON());
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 500,
                message: 'An unexpected error occurred'
            });
        }
    }
    async introspect(req, res) {
        try {
            const { token } = req.body;
            if (!token) {
                winston_1.default.warn('Token validation attempt with missing token');
                res.status(400).json({
                    status: 'error',
                    code: 400,
                    message: 'Token is required'
                });
                return;
            }
            winston_1.default.info('Token validation attempt');
            const result = await authService_1.authService.introspectToken(token);
            winston_1.default.info('Token validation successful');
            res.json(result);
        }
        catch (error) {
            winston_1.default.error('Token validation failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            if (error instanceof baseError_1.BaseError) {
                res.status(error.statusCode).json(error.toJSON());
                return;
            }
            res.status(500).json({
                status: 'error',
                code: 500,
                message: 'An unexpected error occurred'
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
