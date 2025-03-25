/**
 * @fileoverview Authentication service with custom error handling
 * @module services/authService
 */

import jwt, { VerifyErrors, VerifyOptions } from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { TokenPayload, TokenIntrospection, AdminData } from '../types';
import logger from '../config/winston';
import bcrypt from 'bcryptjs';
import { 
  AdminExistsError, 
  AdminNotFoundError, 
  InvalidCredentialsError, 
  InvalidTokenError, 
  PasswordMismatchError 
} from '../errors/authError';

/**
 * Interface representing an admin model
 * @interface
 * @property {string} _id - Admin's unique identifier
 * @property {string} name - Admin's full name
 * @property {string} email - Admin's email address
 * @property {string} password_hash - Hashed password
 * @method comparePassword - Compares a password with the stored hash
 */
interface AdminModel {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  comparePassword(password: string): Promise<boolean>;
}

/**
 * Service class for handling authentication operations
 * @class
 */
export class AuthService {
  private adminModel: typeof Admin;

  /**
   * Creates an instance of AuthService
   * @constructor
   */
  constructor() {
    this.adminModel = Admin;
  }

  /**
   * Creates a new admin account
   * @param {AdminData} adminData - Admin registration data
   * @returns {Promise<{ token: string }>} Object containing the authentication token
   * @throws {Error} If email already exists or there's a database error
   */
  async signup(adminData: AdminData): Promise<{ token: string }> {
    try {
      logger.info('Starting admin signup', { email: adminData.email });
      
      // Check if admin already exists
      const existingAdmin = await this.adminModel.findOne({ email: adminData.email });
      if (existingAdmin) {
        logger.warn('Admin signup failed - email already exists', { email: adminData.email });
        throw new AdminExistsError(adminData.email);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create new admin
      const admin = new this.adminModel({
        name: adminData.name,
        email: adminData.email,
        password_hash: hashedPassword
      });

      const savedAdmin = await admin.save();
      logger.info('Admin created successfully', { adminId: savedAdmin._id });

      // Generate token
      const token = this.generateToken(savedAdmin._id);
      
      logger.info('Token generated for new admin', { adminId: savedAdmin._id });
      return {
        token
      };
    } catch (error) {
      logger.error('Admin signup failed', { 
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
  async signin(email: string, password: string): Promise<{ token: string }> {
    try {
      logger.info('Starting admin signin', { email });
      
      const admin = await this.adminModel.findOne({ email }).select('+password_hash');
      if (!admin) {
        logger.warn('Admin signin failed - email not found', { email });
        throw new InvalidCredentialsError();
      }

      const isValidPassword = await admin.comparePassword(password);
      if (!isValidPassword) {
        logger.warn('Admin signin failed - invalid password', { email });
        throw new InvalidCredentialsError();
      }

      logger.info('Admin signin successful', { adminId: admin._id });
      
      const token = this.generateToken(admin._id);
      
      logger.info('Token generated for admin signin', { adminId: admin._id });
      return {
        token
      };
    } catch (error) {
      logger.error('Admin signin failed', { 
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
  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      logger.info('Starting password change', { adminId });
      
      const admin = await this.adminModel.findById(adminId).select('+password_hash');
      if (!admin) {
        logger.warn('Password change failed - admin not found', { adminId });
        throw new AdminNotFoundError(adminId);
      }

      const isValidPassword = await admin.comparePassword(currentPassword);
      if (!isValidPassword) {
        logger.warn('Password change failed - invalid current password', { adminId });
        throw new PasswordMismatchError();
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      admin.password_hash = hashedPassword;
      await admin.save();

      logger.info('Password changed successfully', { adminId });
      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Password change failed', { 
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
  async introspectToken(token: string): Promise<TokenIntrospection> {
    try {
      logger.info('Starting token introspection');
      
      const verifyOptions: VerifyOptions = {
        algorithms: ['HS256']
      };
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', verifyOptions) as TokenPayload;
      
      const admin = await this.adminModel.findById(decoded.adminId);
      if (!admin) {
        logger.warn('Token introspection failed - admin not found', { adminId: decoded.adminId });
        throw new InvalidTokenError();
      }

      logger.info('Token introspection successful', { adminId: admin._id });
      return {
        active: true,
        admin_id: admin._id,
        name: admin.name,
        email: admin.email,
        scope: 'admin',
        exp: decoded.exp
      };
    } catch (error) {
      logger.error('Token introspection failed', { 
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
  private generateToken(adminId: string): string {
    return jwt.sign(
      { adminId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h', algorithm: 'HS256' }
    );
  }

  /**
   * Verifies a JWT token
   * @param {string} token - JWT token to verify
   * @returns {TokenPayload} Verified token payload
   * @throws {Error} If token is invalid or verification fails
   */
  verifyToken(token: string): TokenPayload {
    try {
      const verifyOptions: VerifyOptions = {
        algorithms: ['HS256']
      };
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', verifyOptions) as TokenPayload;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();
