import { Router } from 'express';
import { attendanceController } from '../controllers/attendanceController';

const router = Router();

// CRUD operations for attendance
router.post('/', attendanceController.markAttendance);
router.get('/', attendanceController.getAttendanceByDate);
router.get('/:contactId', attendanceController.getAttendanceByContact);
router.delete('/:id', attendanceController.deleteAttendance);

// Statistics
router.get('/stats/:date', attendanceController.getAttendanceStats);

export default router;
