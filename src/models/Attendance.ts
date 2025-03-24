import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  contact_id: string;
  date: Date;
  attended: boolean;
  marked_by: string;
  marked_at: Date;
}

const attendanceSchema = new Schema({
  contact_id: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  attended: {
    type: Boolean,
    required: true
  },
  marked_by: {
    type: String,
    required: true
  },
  marked_at: {
    type: Date,
    default: Date.now
  }
});

// Create a unique index to prevent duplicate attendance records
attendanceSchema.index({ contact_id: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
export type AttendanceDocument = mongoose.Document & IAttendance;
