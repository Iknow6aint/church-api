/**
 * @fileoverview Service for managing church attendance records
 * @module services/attendanceService
 */

import { Model } from 'mongoose';
import { AttendanceDocument } from '../models/Attendance';
import { Attendance } from '../models/Attendance';

/**
 * Request interface for marking attendance
 * @interface
 * @property {string} contactId - ID of the contact
 * @property {Date} date - Date of attendance
 * @property {boolean} attended - Whether the contact attended
 * @property {string} markedBy - ID of the person marking attendance
 */
interface MarkAttendanceRequest {
  contactId: string;
  date: Date;
  attended: boolean;
  markedBy: string;
}

/**
 * Request interface for getting attendance by date
 * @interface
 * @property {Date} date - Date to filter attendance
 */
interface GetAttendanceByDateRequest {
  date: Date;
}

/**
 * Request interface for getting attendance by contact
 * @interface
 * @property {string} contactId - ID of the contact
 */
interface GetAttendanceByContactRequest {
  contactId: string;
}

/**
 * Request interface for deleting attendance record
 * @interface
 * @property {string} id - ID of the attendance record
 */
interface DeleteAttendanceRequest {
  id: string;
}

/**
 * Request interface for getting attendance statistics
 * @interface
 * @property {Date} date - Date to get statistics for
 */
interface GetAttendanceStatsRequest {
  date: Date;
}

/**
 * Response interface for attendance statistics
 * @interface
 * @property {number} total_attendance - Total number of attendance records
 * @property {number} present - Number of present records
 * @property {number} absent - Number of absent records
 */
interface AttendanceStatsResponse {
  total_attendance: number;
  present: number;
  absent: number;
}

/**
 * Service class for managing church attendance records
 * @class
 */
export class AttendanceService {
  private attendanceModel: typeof Attendance;

  /**
   * Creates an instance of AttendanceService
   * @constructor
   */
  constructor() {
    this.attendanceModel = Attendance;
  }

  /**
   * Marks attendance for a contact
   * @param {MarkAttendanceRequest} data - Attendance data
   * @returns {Promise<AttendanceDocument>} The created attendance record
   * @throws {Error} If there's an error saving the attendance record
   */
  async markAttendance(data: MarkAttendanceRequest): Promise<AttendanceDocument> {
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
  async getAttendanceByDate(data: GetAttendanceByDateRequest): Promise<AttendanceDocument[]> {
    return await this.attendanceModel.find({ date: new Date(data.date) }).sort({ marked_at: -1 });
  }

  /**
   * Gets attendance records for a specific contact
   * @param {GetAttendanceByContactRequest} data - Contact ID
   * @returns {Promise<AttendanceDocument[]>} Array of attendance records
   */
  async getAttendanceByContact(data: GetAttendanceByContactRequest): Promise<AttendanceDocument[]> {
    return await this.attendanceModel.find({ contact_id: data.contactId }).sort({ date: -1 });
  }

  /**
   * Deletes an attendance record
   * @param {DeleteAttendanceRequest} data - ID of the record to delete
   * @returns {Promise<void>} Promise that resolves when deletion is complete
   */
  async deleteAttendance(data: DeleteAttendanceRequest): Promise<void> {
    await this.attendanceModel.findByIdAndDelete(data.id);
  }

  /**
   * Gets attendance statistics for a specific date
   * @param {GetAttendanceStatsRequest} data - Date to get statistics for
   * @returns {Promise<AttendanceStatsResponse>} Attendance statistics
   */
  async getAttendanceStats(data: GetAttendanceStatsRequest): Promise<AttendanceStatsResponse> {
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

export const attendanceService = new AttendanceService();
