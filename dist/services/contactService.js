"use strict";
/**
 * @fileoverview Service for managing church contacts
 * @module services/contactService
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = exports.ContactService = void 0;
const Contact_1 = require("../models/Contact");
/**
 * Service class for managing church contacts
 * @class
 */
class ContactService {
    constructor() {
        this.contactModel = Contact_1.Contact;
    }
    /**
     * Creates a new contact
     * @param {CreateContactInput} contactData - Contact data to create
     * @returns {Promise<ContactDocument>} The created contact document
     * @throws {Error} If there's a validation error or unexpected error
     */
    async createContact(contactData) {
        const contact = new this.contactModel(contactData);
        try {
            return await contact.save();
        }
        catch (error) {
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
    async getContactById(id) {
        try {
            return await this.contactModel.findById(id);
        }
        catch (error) {
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
    async getAllContacts() {
        try {
            return await this.contactModel.find().sort({ created_at: -1 });
        }
        catch (error) {
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
    async updateContact(id, updateData) {
        try {
            return await this.contactModel.findByIdAndUpdate(id, updateData, { new: true });
        }
        catch (error) {
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
    async deleteContact(id) {
        try {
            return await this.contactModel.findByIdAndDelete(id);
        }
        catch (error) {
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
    async getFirstTimers() {
        try {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return await this.contactModel.find({ first_visit_date: { $gte: oneMonthAgo } });
        }
        catch (error) {
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
    async getContactsByEvangelist(evangelistName) {
        try {
            return await this.contactModel.find({ evangelist_name: evangelistName });
        }
        catch (error) {
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
    async searchContacts(query) {
        try {
            return await this.contactModel.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } },
                    { phone: { $regex: query } },
                    { evangelist_name: { $regex: query, $options: 'i' } }
                ]
            }).sort({ created_at: -1 });
        }
        catch (error) {
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
    async filterContacts(filters) {
        try {
            const query = {};
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
        }
        catch (error) {
            if (error.name === 'CastError') {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }
}
exports.ContactService = ContactService;
exports.contactService = new ContactService();
