import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
