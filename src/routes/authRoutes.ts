import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

// Protected routes
router.put('/change-password', authenticateToken, authController.changePassword);
router.post('/introspect', authenticateToken, authController.introspect);

export default router;
