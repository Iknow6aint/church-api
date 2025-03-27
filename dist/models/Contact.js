"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
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
contactSchema.pre('save', function (next) {
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
contactSchema.virtual('isFirstTimer').get(function () {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return this.first_visit_date >= oneMonthAgo;
});
contactSchema.virtual('attendance', {
    ref: 'Attendance',
    localField: '_id',
    foreignField: 'contactId'
});
const Contact = (0, mongoose_1.model)('Contact', contactSchema);
exports.Contact = Contact;
