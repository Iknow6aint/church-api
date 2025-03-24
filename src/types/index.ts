import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface IAdmin {
  id: string;
  name: string;
  email: string;
}

export interface AdminData {
  name: string;
  email: string;
  password: string;
}

export interface TokenPayload extends jwt.JwtPayload {
  adminId: string;
  exp: number;
}

export interface TokenIntrospection {
  active: boolean;
  admin_id?: string;
  name?: string;
  email?: string;
  scope?: string;
  exp?: number;
  error?: string;
}

export interface AdminRequest extends Request {
  admin?: TokenPayload;
}
