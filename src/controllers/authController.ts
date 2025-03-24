/**
 * @fileoverview Authentication controller with logging
 * @module controllers/authController
 */

import { Request, Response } from 'express';
import { AdminRequest } from '../types';
import { AuthService } from '../services/authService';
import { authService } from '../services/authService';
import logger from '../config/winston';

export class AuthController {
  constructor(private authService: AuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      logger.info('Signup attempt', { email });
      
      const result = await this.authService.signup({
        name,
        email,
        password
      });
      
      logger.info('Signup successful', { email });
      res.status(201).json(result);
    } catch (error) {
      logger.error('Signup failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      logger.info('Signin attempt', { email });
      
      const result = await this.authService.signin(email, req.body.password);
      
      logger.info('Signin successful', { email});
      res.json(result);
    } catch (error) {
      logger.error('Signin failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async changePassword(req: AdminRequest, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      const adminId = req.admin?.adminId;
      
      if (!adminId) {
        logger.warn('Unauthorized password change attempt');
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      logger.info('Password change attempt', { adminId });
      
      const result = await this.authService.changePassword(
        adminId,
        currentPassword,
        newPassword
      );
      
      logger.info('Password changed successfully', { adminId });
      res.json(result);
    } catch (error) {
      logger.error('Password change failed', { 
        adminId: req.admin?.adminId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async introspect(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      
      if (!token) {
        logger.warn('Token validation attempt with missing token');
        res.status(400).json({ error: 'Token is required' });
        return;
      }

      logger.info('Token validation attempt');
      const result = await this.authService.introspectToken(token);
      
      logger.info('Token validation successful', { 
        admin_id: result.admin_id,
        exp: result.exp
      });
      res.json(result);
    } catch (error) {
      logger.error('Token validation failed', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

export const authController = new AuthController(authService);
