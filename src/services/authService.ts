import jwt, { VerifyErrors, VerifyOptions } from 'jsonwebtoken';
import { Admin } from '../models/Admin';
import { TokenPayload, TokenIntrospection, AdminData } from '../types';

interface AdminModel {
  _id: string;
  name: string;
  email: string;
  password_hash: string;
  comparePassword(password: string): Promise<boolean>;
}

export class AuthService {
  private adminModel: typeof Admin;

  constructor() {
    this.adminModel = Admin;
  }

  async signup(adminData: AdminData): Promise<{ token: string }> {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async signin(email: string, password: string): Promise<{ token: string }> {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async changePassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
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
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async introspectToken(token: string): Promise<TokenIntrospection> {
    try {
      const verifyOptions: VerifyOptions = {
        algorithms: ['HS256']
      };
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', verifyOptions) as TokenPayload;
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
    } catch (error) {
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

  private generateToken(adminId: string): string {
    return jwt.sign(
      { adminId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h', algorithm: 'HS256' }
    );
  }

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
