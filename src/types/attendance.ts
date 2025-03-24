import { Request } from 'express';

export interface MarkAttendanceRequest {
  contactId: string;
  date: string;
  attended: boolean;
  markedBy: string;
}

export interface GetAttendanceByDateRequest {
  date: string;
}

export interface GetAttendanceByContactRequest {
  contactId: string;
}

export interface DeleteAttendanceRequest {
  id: string;
}

export interface GetAttendanceStatsRequest {
  date: string;
}

export interface AttendanceStats {
  total_attendance: number;
  present: number;
  absent: number;
}
