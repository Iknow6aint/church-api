import { Model } from 'mongoose';
import { AttendanceDocument } from '../models/Attendance';
import { Attendance } from '../models/Attendance';

interface MarkAttendanceRequest {
  contactId: string;
  date: Date;
  attended: boolean;
  markedBy: string;
}

interface GetAttendanceByDateRequest {
  date: Date;
}

interface GetAttendanceByContactRequest {
  contactId: string;
}

interface DeleteAttendanceRequest {
  id: string;
}

interface GetAttendanceStatsRequest {
  date: Date;
}

interface AttendanceStatsResponse {
  total_attendance: number;
  present: number;
  absent: number;
}

export class AttendanceService{
  private attendanceModel: typeof Attendance;
  constructor() {
    this.attendanceModel = Attendance;
  }

  async markAttendance(data: MarkAttendanceRequest): Promise<AttendanceDocument> {
    const attendance = new this.attendanceModel({
      contact_id: data.contactId,
      date: new Date(data.date),
      attended: data.attended,
      marked_by: data.markedBy
    });
    return await attendance.save();
  }

  async getAttendanceByDate(data: GetAttendanceByDateRequest): Promise<AttendanceDocument[]> {
    return await this.attendanceModel.find({ date: new Date(data.date) }).sort({ marked_at: -1 });
  }

  async getAttendanceByContact(data: GetAttendanceByContactRequest): Promise<AttendanceDocument[]> {
    return await this.attendanceModel.find({ contact_id: data.contactId }).sort({ date: -1 });
  }

  async deleteAttendance(data: DeleteAttendanceRequest): Promise<void> {
    await this.attendanceModel.findByIdAndDelete(data.id);
  }

  async getAttendanceStats(data: GetAttendanceStatsRequest): Promise<any> {
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
