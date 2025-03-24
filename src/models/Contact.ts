import { Schema, model, Document } from 'mongoose';

interface ContactDocument extends Document {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  evangelist_name: string;
  first_visit_date: Date;
  created_at: Date;
  updated_at: Date;
  attendance_count: number;
  last_attendance: any;
  isFirstTimer: boolean;
}

const contactSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female'] },
  phone: { type: String, required: true },
  email: { type: String },
  evangelist_name: { type: String, required: true },
  first_visit_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

contactSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

contactSchema.virtual('attendance_count', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'contactId',
  justOne: false,
  count: true
});

contactSchema.virtual('last_attendance', {
  ref: 'Attendance',
  localField: '_id',
  foreignField: 'contactId',
  justOne: true,
  sort: { date: -1 }
});

contactSchema.virtual('isFirstTimer').get(function(this: ContactDocument) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  return this.first_visit_date >= oneMonthAgo;
});


const Contact = model<ContactDocument>('Contact', contactSchema);

export { Contact, ContactDocument };
