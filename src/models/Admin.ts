import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true,
    select: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
