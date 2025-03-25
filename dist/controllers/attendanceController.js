"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceController = exports.AttendanceController = void 0;
const attendanceService_1 = require("../services/attendanceService");
class AttendanceController {
    async markAttendance(req, res) {
        try {
            const { contactId, date, attended, markedBy } = req.body;
            if (!contactId || !date || !attended || !markedBy) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            const attendance = await attendanceService_1.attendanceService.markAttendance({
                contactId,
                date: new Date(date),
                attended,
                markedBy
            });
            res.status(201).json(attendance);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getAttendanceByDate(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                res.status(400).json({ error: 'Date is required' });
                return;
            }
            const attendance = await attendanceService_1.attendanceService.getAttendanceByDate({
                date: new Date(date)
            });
            res.json(attendance);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getAttendanceByContact(req, res) {
        try {
            const { contactId } = req.params;
            if (!contactId) {
                res.status(400).json({ error: 'Contact ID is required' });
                return;
            }
            const attendance = await attendanceService_1.attendanceService.getAttendanceByContact({
                contactId
            });
            res.json(attendance);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async deleteAttendance(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ error: 'ID is required' });
                return;
            }
            await attendanceService_1.attendanceService.deleteAttendance({
                id
            });
            res.json({ message: 'Attendance record deleted successfully' });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getAttendanceStats(req, res) {
        try {
            const { date } = req.query;
            if (!date) {
                res.status(400).json({ error: 'Date is required' });
                return;
            }
            const stats = await attendanceService_1.attendanceService.getAttendanceStats({
                date: new Date(date)
            });
            res.json(stats);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}
exports.AttendanceController = AttendanceController;
exports.attendanceController = new AttendanceController();
