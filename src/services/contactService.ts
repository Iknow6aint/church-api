/**
 * @fileoverview Service for managing church contacts
 * @module services/contactService
 */

import { Contact, ContactDocument } from '../models/Contact';
import { CreateContactInput, UpdateContactInput } from '../types/contact';
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
}

export const contactService = new ContactService();
