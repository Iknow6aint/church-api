import { Contact, ContactDocument } from '../models/Contact';
import { CreateContactInput, UpdateContactInput } from '../types/contact';

interface CreateContactData {
  name: string;
  gender: 'male' | 'female';
  phone: string;
  email?: string;
  evangelist_name: string;
  first_visit_date: Date;
}

interface UpdateContactData {
  name?: string;
  gender?: 'male' | 'female';
  phone?: string;
  email?: string;
  evangelist_name?: string;
  first_visit_date?: Date;
}

export class ContactService {
  private contactModel = Contact;

  async createContact(contactData: CreateContactInput): Promise<ContactDocument> {
    try {
      const contact = new this.contactModel(contactData);
      return await contact.save();
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async getContactById(id: string): Promise<ContactDocument | null> {
    try {
      return await this.contactModel.findById(id);
    } catch (error: any) {
      if (error.name === 'CastError') {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

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
}

export const contactService = new ContactService();
