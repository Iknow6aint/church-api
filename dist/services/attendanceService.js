"use strict";
/**
 * @fileoverview Service for managing church attendance records
 * @module services/attendanceService
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceService = exports.AttendanceService = void 0;
const Attendance_1 = require("../models/Attendance");
/**
 * Service class for managing church attendance records
 * @class
 */
class AttendanceService {
    /**
     * Creates an instance of AttendanceService
     * @constructor
     */
    constructor() {
        this.attendanceModel = Attendance_1.Attendance;
    }
    /**
     * Marks attendance for a contact
     * @param {MarkAttendanceRequest} data - Attendance data
     * @returns {Promise<AttendanceDocument>} The created attendance record
     * @throws {Error} If there's an error saving the attendance record
     */
    async markAttendance(data) {
        const attendance = new this.attendanceModel({
            contact_id: data.contactId,
            date: new Date(data.date),
            attended: data.attended,
            marked_by: data.markedBy
        });
        return await attendance.save();
    }
    /**
     * Gets attendance records for a specific date
     * @param {GetAttendanceByDateRequest} data - Date filter
     * @returns {Promise<AttendanceDocument[]>} Array of attendance records
     */
    async getAttendanceByDate(data) {
        return await this.attendanceModel.find({ date: new Date(data.date) }).sort({ marked_at: -1 });
    }
    /**
     * Gets attendance records for a specific contact
     * @param {GetAttendanceByContactRequest} data - Contact ID
     * @returns {Promise<AttendanceDocument[]>} Array of attendance records
     */
    async getAttendanceByContact(data) {
        return await this.attendanceModel.find({ contact_id: data.contactId }).sort({ date: -1 });
    }
    /**
     * Deletes an attendance record
     * @param {DeleteAttendanceRequest} data - ID of the record to delete
     * @returns {Promise<void>} Promise that resolves when deletion is complete
     */
    async deleteAttendance(data) {
        await this.attendanceModel.findByIdAndDelete(data.id);
    }
    /**
     * Gets attendance statistics for a specific date
     * @param {GetAttendanceStatsRequest} data - Date to get statistics for
     * @returns {Promise<AttendanceStatsResponse>} Attendance statistics
     */
    async getAttendanceStats(data) {
        const attendance = await this.attendanceModel.find({ date: new Date(data.date) });
        const total = attendance.length;
        const present = attendance.filter(a => a.attended).length;
        const absent = total - present;
        return {
            total_attendance: total,
            present,
            absent
        };
    }
}
exports.AttendanceService = AttendanceService;
exports.attendanceService = new AttendanceService();
