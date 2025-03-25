import { Request, Response } from 'express';
import { attendanceService } from '../services/attendanceService';
import { 
  MarkAttendanceRequest,
  GetAttendanceByDateRequest,
  GetAttendanceByContactRequest,
  DeleteAttendanceRequest,
  GetAttendanceStatsRequest
} from '../types/attendance';
import { IAttendanceService } from '../types/services';

export class AttendanceController {

  

  async markAttendance(req: Request<{}, {}, MarkAttendanceRequest>, res: Response): Promise<void> {
    try {
      const { contactId, date, attended, markedBy } = req.body;
      if (!contactId || !date || !attended || !markedBy) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }
      const attendance = await attendanceService.markAttendance({
        contactId,
        date: new Date(date),
        attended,
        markedBy
      });
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getAttendanceByDate(req: Request<{}, {}, {}, GetAttendanceByDateRequest>, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      if (!date) {
        res.status(400).json({ error: 'Date is required' });
        return;
      }
      const attendance = await attendanceService.getAttendanceByDate({
        date: new Date(date)
      });
      res.json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getAttendanceByContact(req: Request<{ contactId: string }, {}, {}, GetAttendanceByContactRequest>, res: Response): Promise<void> {
    try {
      const { contactId } = req.params;
      if (!contactId) {
        res.status(400).json({ error: 'Contact ID is required' });
        return;
      }
      const attendance = await attendanceService.getAttendanceByContact({
        contactId
      });
      res.json(attendance);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async deleteAttendance(req: Request<{ id: string }, {}, {}, DeleteAttendanceRequest>, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'ID is required' });
        return;
      }
      await attendanceService.deleteAttendance({
        id
      });
      res.json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getAttendanceStats(req: Request<{}, {}, {}, GetAttendanceStatsRequest>, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      if (!date) {
        res.status(400).json({ error: 'Date is required' });
        return;
      }
      const stats = await attendanceService.getAttendanceStats({
        date: new Date(date)
      });
      res.json(stats);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

export const attendanceController = new AttendanceController();
