/**
 * @fileoverview API routes for managing church attendance
 * @module routes/attendanceRoutes
 */

import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController';

const router = Router();

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Mark attendance for a contact
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactId
 *               - date
 *               - attended
 *               - markedBy
 *             properties:
 *               contactId:
 *                 type: string
 *                 description: ID of the contact
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of attendance
 *               attended:
 *                 type: boolean
 *                 description: Whether the contact attended
 *               markedBy:
 *                 type: string
 *                 description: ID of the person marking attendance
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Attendance record ID
 *                 contact_id:
 *                   type: string
 *                   description: Contact ID
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Attendance date
 *                 attended:
 *                   type: boolean
 *                   description: Attendance status
 *                 marked_by:
 *                   type: string
 *                   description: ID of the person who marked attendance
 *                 marked_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when attendance was marked
 *       400:
 *         description: Bad request (invalid data)
 *       500:
 *         description: Internal server error
 */
router.post('/', attendanceController.markAttendance);

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get attendance records for a specific date
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date to filter attendance records
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Attendance record ID
 *                   contact_id:
 *                     type: string
 *                     description: Contact ID
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Attendance date
 *                   attended:
 *                     type: boolean
 *                     description: Attendance status
 *                   marked_by:
 *                     type: string
 *                     description: ID of the person who marked attendance
 *                   marked_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when attendance was marked
 *       500:
 *         description: Internal server error
 */
router.get('/', attendanceController.getAttendanceByDate);

/**
 * @swagger
 * /attendance/{contactId}:
 *   get:
 *     summary: Get attendance records for a specific contact
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contact
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Attendance record ID
 *                   contact_id:
 *                     type: string
 *                     description: Contact ID
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: Attendance date
 *                   attended:
 *                     type: boolean
 *                     description: Attendance status
 *                   marked_by:
 *                     type: string
 *                     description: ID of the person who marked attendance
 *                   marked_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when attendance was marked
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.get('/:contactId', attendanceController.getAttendanceByContact);

/**
 * @swagger
 * /attendance/{id}:
 *   delete:
 *     summary: Delete an attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the attendance record to delete
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Attendance record not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', attendanceController.deleteAttendance);

/**
 * @swagger
 * /attendance/stats/{date}:
 *   get:
 *     summary: Get attendance statistics for a specific date
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date to get statistics for
 *     responses:
 *       200:
 *         description: Attendance statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_attendance:
 *                   type: number
 *                   description: Total number of attendance records
 *                 present:
 *                   type: number
 *                   description: Number of present records
 *                 absent:
 *                   type: number
 *                   description: Number of absent records
 *       500:
 *         description: Internal server error
 */
router.get('/stats/:date', attendanceController.getAttendanceStats);

export default router;
