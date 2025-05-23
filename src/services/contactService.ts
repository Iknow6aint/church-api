/**
 * @fileoverview Service for managing church contacts
 * @module services/contactService
 */

import { Contact, ContactDocument } from '../models/Contact';
import { CreateContactInput, DashboardAnalytics, UpdateContactInput } from '../types/contact';
import { Attendance } from '../models/Attendance';

/**
 * Interface for creating a new contact
 * @interface
 * @property {string} name - Contact's full name
 * @property {'male' | 'female'} gender - Contact's gender
 * @property {string} phone - Contact's phone number
 * @property {string} [email] - Contact's email address (optional)
 * @property {string} evangelist_name - Name of the evangelist
 * @property {Date} first_visit_date - Date of first visit
 */
interface CreateContactData {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  evangelist_name: string;
  first_visit_date: Date;
}

/**
 * Interface for updating a contact
 * @interface
 * @property {string} [name] - Contact's full name
 * @property {'male' | 'female'} [gender] - Contact's gender
 * @property {string} [phone] - Contact's phone number
 * @property {string} [email] - Contact's email address
 * @property {string} [evangelist_name] - Name of the evangelist
 * @property {Date} [first_visit_date] - Date of first visit
 */
interface UpdateContactData {
  name?: string;
  gender?: 'male' | 'female';
  phone?: string;
  email?: string;
  evangelist_name?: string;
  first_visit_date?: Date;
}

/**
 * Service class for managing church contacts
 * @class
 */
export class ContactService {
  private contactModel = Contact;

  /**
   * Creates a new contact
   * @param {CreateContactInput} contactData - Contact data to create
   * @returns {Promise<ContactDocument>} The created contact document
   * @throws {Error} If there's a validation error or unexpected error
   */
  async createContact(contactData: CreateContactInput): Promise<ContactDocument> {
    const contact = new this.contactModel(contactData);
    try {
      return await contact.save();
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Gets a contact by ID
   * @param {string} id - Contact's ID
   * @returns {Promise<ContactDocument | null>} The contact document or null if not found
   * @throws {Error} If ID is invalid or unexpected error occurs
   */
  async getContactById(id: string): Promise<ContactDocument | null> {
    try {
      const contact = await this.contactModel.findById(id);
      if (!contact) {
        return null;
      }

      // Fetch all attendance records for this contact
      const attendanceRecords = await Attendance.find({ contact_id: id })
        .sort({ date: -1 });

      // Add attendance records to the contact object
      contact.attendance = attendanceRecords;
      
      return contact;
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Gets all contacts
   * @returns {Promise<ContactDocument[]>} Array of all contact documents
   * @throws {Error} If there's an unexpected error
   */
  async getAllContacts(): Promise<ContactDocument[]> {
    try {
      return await this.contactModel.find().sort({ created_at: -1 });
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Updates a contact
   * @param {string} id - Contact's ID
   * @param {UpdateContactInput} updateData - Data to update
   * @returns {Promise<ContactDocument | null>} The updated contact document or null if not found
   * @throws {Error} If ID is invalid, validation fails, or unexpected error occurs
   */
  async updateContact(id: string, updateData: UpdateContactInput): Promise<ContactDocument | null> {
    try {
      return await this.contactModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } catch (error: any) {
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Deletes a contact
   * @param {string} id - Contact's ID
   * @returns {Promise<ContactDocument | null>} The deleted contact document or null if not found
   * @throws {Error} If ID is invalid or unexpected error occurs
   */
  async deleteContact(id: string): Promise<ContactDocument | null> {
    try {
      return await this.contactModel.findByIdAndDelete(id);
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Gets first-time visitors from the last month
   * @returns {Promise<ContactDocument[]>} Array of first-time visitors
   * @throws {Error} If there's an unexpected error
   */
  async getFirstTimers(): Promise<ContactDocument[]> {
    try {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return await this.contactModel.find({ first_visit_date: { $gte: oneMonthAgo } });
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Gets contacts by evangelist
   * @param {string} evangelistName - Name of the evangelist
   * @returns {Promise<ContactDocument[]>} Array of contacts for the evangelist
   * @throws {Error} If there's an unexpected error
   */
  async getContactsByEvangelist(evangelistName: string): Promise<ContactDocument[]> {
    try {
      return await this.contactModel.find({ evangelist_name: evangelistName });
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Searches contacts by name, email, phone, or evangelist name
   * @param {string} query - Search term
   * @returns {Promise<ContactDocument[]>} Array of matching contacts
   * @throws {Error} If there's an unexpected error
   */
  async searchContacts(query: string): Promise<ContactDocument[]> {
    try {
      return await this.contactModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { phone: { $regex: query } },
          { evangelist_name: { $regex: query, $options: 'i' } }
        ]
      }).sort({ created_at: -1 });
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Filters contacts by various criteria
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.gender] - Gender filter
   * @param {string} [filters.evangelist] - Evangelist name filter
   * @param {Object} [filters.dateRange] - Date range filter
   * @param {string} filters.dateRange.start - Start date
   * @param {string} filters.dateRange.end - End date
   * @returns {Promise<ContactDocument[]>} Array of filtered contacts
   * @throws {Error} If there's an unexpected error
   */
  async filterContacts(filters: {
    gender?: string;
    evangelist?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  }): Promise<ContactDocument[]> {
    try {
      const query: any = {};

      if (filters.gender) {
        query.gender = filters.gender;
      }

      if (filters.evangelist) {
        query.evangelist_name = filters.evangelist;
      }

      if (filters.dateRange) {
        query.first_visit_date = {
          $gte: new Date(filters.dateRange.start),
          $lte: new Date(filters.dateRange.end)
        };
      }

      return await this.contactModel.find(query).sort({ created_at: -1 });
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  /**
   * Get complete dashboard analytics data
   * @returns Dashboard analytics data
   */
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    // Calculate current date and dates for 5 weeks ago
    const currentDate = new Date();
    const fiveWeeksAgo = new Date();
    fiveWeeksAgo.setDate(currentDate.getDate() - 35); // 5 weeks * 7 days

    // Get total contacts count
    const totalContacts = await Contact.countDocuments();
    
    // Get contacts who attended at least once
    const contactsAttendedAtLeastOnce = await Attendance.distinct('contact_id');
    const attendedAtLeastOnceCount = contactsAttendedAtLeastOnce.length;
    
    // Get contacts who are still attending (attended in the last 5 weeks)
    const recentAttendees = await Attendance.distinct('contact_id', {
      date: { $gte: fiveWeeksAgo }
    });
    const stillAttendingCount = recentAttendees.length;
    
    // Gender distribution
    const maleCount = await Contact.countDocuments({ gender: 'male' });
    const femaleCount = await Contact.countDocuments({ gender: 'female' });
    
    // Weekly attendance trend (last 10 weeks)
    const weeklyAttendanceTrend = await this.getWeeklyAttendanceTrend(10);
    
    // 5-week retention breakdown
    const retentionBreakdown = await this.getRetentionBreakdown(5);

    // Compile all data
    return {
      totalContacts,
      attendedAtLeastOnce: {
        count: attendedAtLeastOnceCount,
        percentage: totalContacts > 0 ? (attendedAtLeastOnceCount / totalContacts) * 100 : 0
      },
      stillAttending: {
        count: stillAttendingCount,
        percentage: totalContacts > 0 ? (stillAttendingCount / totalContacts) * 100 : 0
      },
      weeklyAttendanceTrend,
      genderDistribution: {
        male: {
          count: maleCount,
          percentage: totalContacts > 0 ? (maleCount / totalContacts) * 100 : 0
        },
        female: {
          count: femaleCount,
          percentage: totalContacts > 0 ? (femaleCount / totalContacts) * 100 : 0
        }
      },
      retentionBreakdown
    };
  }

  /**
   * Get weekly attendance trend for the specified number of weeks
   * @param weekCount - Number of weeks to analyze
   * @returns Weekly attendance data
   */
  private async getWeeklyAttendanceTrend(weekCount: number): Promise<Array<{ week: number; count: number }>> {
    const result: Array<{ week: number; count: number }> = [];
    const currentDate = new Date();
    
    for (let i = weekCount - 1; i >= 0; i--) {
      // Calculate start and end of the week
      const weekStart = new Date();
      weekStart.setDate(currentDate.getDate() - (i * 7) - 6);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date();
      weekEnd.setDate(currentDate.getDate() - (i * 7));
      weekEnd.setHours(23, 59, 59, 999);
      
      // Count attendances in this week
      const weeklyCount = await Attendance.countDocuments({
        date: { $gte: weekStart, $lte: weekEnd },
        attended: true
      });
      
      result.push({
        week: weekCount - i,
        count: weeklyCount
      });
    }
    
    return result;
  }

  /**
   * Get retention breakdown for the specified number of weeks
   * @param weeks - Number of weeks to analyze for retention
   * @returns Retention breakdown data
   */
  private async getRetentionBreakdown(weeks: number): Promise<{
    stillAttending: { count: number; percentage: number };
    dropOut: { count: number; percentage: number };
  }> {
    // Define the date ranges
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - (weeks * 7));
    
    // Find contacts who attended at least once in the first week of the period
    const periodStart = new Date(startDate);
    const periodFirstWeekEnd = new Date(startDate);
    periodFirstWeekEnd.setDate(periodStart.getDate() + 7);
    
    // Get contacts who attended in the first week of the period
    const firstWeekAttendees = await Attendance.distinct('contact_id', {
      date: { $gte: periodStart, $lt: periodFirstWeekEnd },
      attended: true
    });
    
    if (firstWeekAttendees.length === 0) {
      return {
        stillAttending: { count: 0, percentage: 0 },
        dropOut: { count: 0, percentage: 0 }
      };
    }
    
    // Get the most recent week
    const recentWeekStart = new Date();
    recentWeekStart.setDate(currentDate.getDate() - 7);
    
    // Find how many of those first week attendees also attended in the most recent week
    const stillAttendingIds = await Attendance.distinct('contact_id', {
      contact_id: { $in: firstWeekAttendees },
      date: { $gte: recentWeekStart, $lte: currentDate },
      attended: true
    });
    
    const stillAttendingCount = stillAttendingIds.length;
    const dropOutCount = firstWeekAttendees.length - stillAttendingCount;
    
    return {
      stillAttending: {
        count: stillAttendingCount,
        percentage: (stillAttendingCount / firstWeekAttendees.length) * 100
      },
      dropOut: {
        count: dropOutCount,
        percentage: (dropOutCount / firstWeekAttendees.length) * 100
      }
    };
  }
}

export const contactService = new ContactService();
