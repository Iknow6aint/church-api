import { MarkAttendanceRequest, GetAttendanceByDateRequest, GetAttendanceByContactRequest, DeleteAttendanceRequest, GetAttendanceStatsRequest } from './attendance';
import { AttendanceDocument } from '../models/Attendance';

export interface IContactService {
  createContact(contactData: {
    name: string;
    gender: 'male' | 'female';
    phone: string;
    email?: string;
    evangelist_name: string;
    first_visit_date: Date;
  }): Promise<any>;

  getContactById(id: string): Promise<any | null>;

  getAllContacts(): Promise<any[]>;

  updateContact(id: string, updateData: {
    name?: string;
    gender?: 'male' | 'female';
    phone?: string;
    email?: string;
    evangelist_name?: string;
    first_visit_date?: Date;
  }): Promise<any | null>;

  deleteContact(id: string): Promise<any | null>;

  getFirstTimers(): Promise<any[]>;

  getContactsByEvangelist(evangelistName: string): Promise<any[]>;

  searchContacts(query: string): Promise<any[]>;

  filterContacts(filters: {
    gender?: string;
    evangelist?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<any[]>;
}

export interface IAttendanceService {
  markAttendance(data: any): Promise<AttendanceDocument>;
  getAttendanceByDate(data: any): Promise<AttendanceDocument[]>;
  getAttendanceByContact(data: any): Promise<AttendanceDocument[]>;
  deleteAttendance(data: any): Promise<void>;
  getAttendanceStats(data: any): Promise<any>;
}
