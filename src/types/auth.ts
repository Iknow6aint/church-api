import { Request } from 'express';

export interface AdminRequest extends Request {
  admin?: {
    adminId: string;
    name: string;
    email: string;
  };
}

export interface SignupRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface SigninRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface ChangePasswordRequest extends Request {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

export interface IntrospectRequest extends Request {
  body: {
    token: string;
  };
}
