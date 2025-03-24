"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../models/Admin");
class AuthService {
    constructor() {
        this.adminModel = Admin_1.Admin;
    }
    async signup(adminData) {
        try {
            const existingAdmin = await this.adminModel.findOne({ email: adminData.email });
            if (existingAdmin) {
                throw new Error('Email already exists');
            }
            const admin = new this.adminModel({
                name: adminData.name,
                email: adminData.email,
                password_hash: adminData.password
            });
            await admin.save();
            const token = this.generateToken(admin._id);
            return {
                token
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
    async signin(email, password) {
        try {
            const admin = await this.adminModel.findOne({ email }).select('+password_hash');
            if (!admin) {
                throw new Error('Invalid credentials');
            }
            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            const token = this.generateToken(admin._id);
            return {
                token
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
    async changePassword(adminId, currentPassword, newPassword) {
        try {
            const admin = await this.adminModel.findById(adminId).select('+password_hash');
            if (!admin) {
                throw new Error('Admin not found');
            }
            const isMatch = await admin.comparePassword(currentPassword);
            if (!isMatch) {
                throw new Error('Current password is incorrect');
            }
            admin.password_hash = newPassword;
            await admin.save();
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
    async introspectToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const admin = await this.adminModel.findById(decoded.adminId);
            if (!admin) {
                throw new Error('Admin not found');
            }
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
            if (error instanceof Error) {
                return {
                    active: false,
                    error: error.message
                };
            }
            return {
                active: false,
                error: 'An unexpected error occurred'
            };
        }
    }
    generateToken(adminId) {
        return jsonwebtoken_1.default.sign({ adminId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
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
