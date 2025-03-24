import { Request, Response } from 'express';
import { AdminRequest } from '../types';
import { AuthService } from '../services/authService';
import { authService } from '../services/authService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.signup({
        name,
        email,
        password
      });
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.signin(email, password);
      res.json(result);
    } catch (error) {
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
      if (!req.admin?.adminId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const result = await this.authService.changePassword(
        req.admin.adminId,
        currentPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
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
        res.status(400).json({ error: 'Token is required' });
        return;
      }

      const result = await this.authService.introspectToken(token);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

export const authController = new AuthController(authService);
