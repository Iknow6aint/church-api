/**
 * @fileoverview API routes for authentication
 * @module routes/authRoutes
 */

import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new admin account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Admin's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin's password
 *     responses:
 *       201:
 *         description: Admin account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       400:
 *         description: Bad request (email already exists)
 *       500:
 *         description: Internal server error
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Authenticate an admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin's password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *       401:
 *         description: Unauthorized (invalid credentials)
 *       500:
 *         description: Internal server error
 */
router.post('/signin', authController.signin);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change admin password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized (invalid token or current password)
 *       500:
 *         description: Internal server error
 */
router.put('/change-password', authenticateToken, authController.changePassword);

/**
 * @swagger
 * /auth/introspect:
 *   post:
 *     summary: Validate JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active:
 *                   type: boolean
 *                   description: Token validity status
 *                 exp:
 *                   type: integer
 *                   description: Token expiration time
 *                 iat:
 *                   type: integer
 *                   description: Token issued at time
 *                 sub:
 *                   type: string
 *                   description: Subject identifier
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: User ID
 *                     name:
 *                       type: string
 *                       description: User name
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: User email
 *       401:
 *         description: Unauthorized (invalid token)
 *       500:
 *         description: Internal server error
 */
router.post('/introspect', authenticateToken, authController.introspect);

export default router;
