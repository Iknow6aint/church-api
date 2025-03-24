import { RequestHandler, Request, Response, NextFunction } from 'express';
import { AdminRequest } from '../types';
import { authService } from '../services/authService';

export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Invalid token format' });
      return;
    }

    const decoded = authService.verifyToken(token);
    (req as AdminRequest).admin = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(401).json({ error: 'An unexpected error occurred' });
    return;
  }
};
