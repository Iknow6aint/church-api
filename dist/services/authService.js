"use strict";
/**
 * @fileoverview Authentication service with custom error handling
 * @module services/authService
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
const winston_1 = __importDefault(require("../config/winston"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authError_1 = require("../errors/authError");
/**
 * Service class for handling authentication operations
 * @class
 */
class AuthService {
    /**
     * Creates an instance of AuthService
     * @constructor
     */
    constructor() {
        this.adminModel = Admin_1.Admin;
    }
    /**
     * Creates a new admin account
     * @param {AdminData} adminData - Admin registration data
     * @returns {Promise<{ token: string }>} Object containing the authentication token
     * @throws {Error} If email already exists or there's a database error
     */
    async signup(adminData) {
        try {
            winston_1.default.info('Starting admin signup', { email: adminData.email });
            // Check if admin already exists
            const existingAdmin = await this.adminModel.findOne({ email: adminData.email });
            if (existingAdmin) {
                winston_1.default.warn('Admin signup failed - email already exists', { email: adminData.email });
                throw new authError_1.AdminExistsError(adminData.email);
            }
            // Hash password
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(adminData.password, salt);
            // Create new admin
            const admin = new this.adminModel({
                name: adminData.name,
                email: adminData.email,
                password_hash: hashedPassword
            });
            const savedAdmin = await admin.save();
            winston_1.default.info('Admin created successfully', { adminId: savedAdmin._id });
            // Generate token
            const token = this.generateToken(savedAdmin._id);
            winston_1.default.info('Token generated for new admin', { adminId: savedAdmin._id });
            return {
                token
            };
        }
        catch (error) {
            winston_1.default.error('Admin signup failed', {
                email: adminData.email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    /**
     * Authenticates an admin and returns a token
     * @param {string} email - Admin's email address
     * @param {string} password - Admin's password
     * @returns {Promise<{ token: string }>} Object containing the authentication token
     * @throws {Error} If credentials are invalid or there's a database error
     */
    async signin(email, password) {
        try {
            winston_1.default.info('Starting admin signin', { email });
            const admin = await this.adminModel.findOne({ email }).select('+password_hash');
            if (!admin) {
                winston_1.default.warn('Admin signin failed - email not found', { email });
                throw new authError_1.InvalidCredentialsError();
            }
            const isValidPassword = await admin.comparePassword(password);
            if (!isValidPassword) {
                winston_1.default.warn('Admin signin failed - invalid password', { email });
                throw new authError_1.InvalidCredentialsError();
            }
            winston_1.default.info('Admin signin successful', { adminId: admin._id });
            const token = this.generateToken(admin._id);
            winston_1.default.info('Token generated for admin signin', { adminId: admin._id });
            return {
                token
            };
        }
        catch (error) {
            winston_1.default.error('Admin signin failed', {
                email,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    /**
     * Changes an admin's password
     * @param {string} adminId - ID of the admin
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<{ message: string }>} Success message
     * @throws {Error} If admin not found, current password is incorrect, or there's a database error
     */
    async changePassword(adminId, currentPassword, newPassword) {
        try {
            winston_1.default.info('Starting password change', { adminId });
            const admin = await this.adminModel.findById(adminId).select('+password_hash');
            if (!admin) {
                winston_1.default.warn('Password change failed - admin not found', { adminId });
                throw new authError_1.AdminNotFoundError(adminId);
            }
            const isValidPassword = await admin.comparePassword(currentPassword);
            if (!isValidPassword) {
                winston_1.default.warn('Password change failed - invalid current password', { adminId });
                throw new authError_1.PasswordMismatchError();
            }
            // Hash new password
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
            admin.password_hash = hashedPassword;
            await admin.save();
            winston_1.default.info('Password changed successfully', { adminId });
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            winston_1.default.error('Password change failed', {
                adminId,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    /**
     * Validates a JWT token
     * @param {string} token - JWT token to validate
     * @returns {Promise<TokenIntrospection>} Token validation result
     * @throws {Error} If token is invalid or verification fails
     */
    async introspectToken(token) {
        try {
            winston_1.default.info('Starting token introspection');
            const verifyOptions = {
                algorithms: ['HS256']
            };
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key', verifyOptions);
            const admin = await this.adminModel.findById(decoded.adminId);
            if (!admin) {
                winston_1.default.warn('Token introspection failed - admin not found', { adminId: decoded.adminId });
                throw new authError_1.InvalidTokenError();
            }
            winston_1.default.info('Token introspection successful', { adminId: admin._id });
            return {
                active: true,
                admin_id: admin._id,
                name: admin.name,
                email: admin.email,
                scope: 'admin',
                exp: decoded.exp
            };
        }
        catch (error) {
            winston_1.default.error('Token introspection failed', {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    /**
     * Generates a JWT token for an admin
     * @param {string} adminId - Admin's unique identifier
     * @returns {string} JWT token
     * @private
     */
    generateToken(adminId) {
        return jsonwebtoken_1.default.sign({ adminId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h', algorithm: 'HS256' });
    }
    /**
     * Verifies a JWT token
     * @param {string} token - JWT token to verify
     * @returns {TokenPayload} Verified token payload
     * @throws {Error} If token is invalid or verification fails
     */
    verifyToken(token) {
        try {
            const verifyOptions = {
                algorithms: ['HS256']
            };
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key', verifyOptions);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Invalid or expired token');
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
