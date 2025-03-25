"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = exports.ContactController = void 0;
const contactService_1 = require("../services/contactService");
class ContactController {
    async createContact(req, res) {
        try {
            const { first_visit_date, ...rest } = req.body;
            const contact = await contactService_1.contactService.createContact({
                ...rest,
                first_visit_date: new Date(first_visit_date)
            });
            res.status(201).json(contact);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getContactById(req, res) {
        try {
            const contact = await contactService_1.contactService.getContactById(req.params.id);
            if (!contact) {
                res.status(404).json({ error: 'Contact not found' });
                return;
            }
            res.json(contact);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getAllContacts(req, res) {
        try {
            const contacts = await contactService_1.contactService.getAllContacts();
            res.json(contacts);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async updateContact(req, res) {
        try {
            const { first_visit_date, ...rest } = req.body;
            const updateData = {
                ...rest,
                ...(first_visit_date && { first_visit_date: new Date(first_visit_date) })
            };
            const contact = await contactService_1.contactService.updateContact(req.params.id, updateData);
            if (!contact) {
                res.status(404).json({ error: 'Contact not found' });
                return;
            }
            res.json(contact);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async deleteContact(req, res) {
        try {
            const contact = await contactService_1.contactService.deleteContact(req.params.id);
            if (!contact) {
                res.status(404).json({ error: 'Contact not found' });
                return;
            }
            res.json({ message: 'Contact deleted successfully' });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getFirstTimers(req, res) {
        try {
            const contacts = await contactService_1.contactService.getFirstTimers();
            res.json(contacts);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async getContactsByEvangelist(req, res) {
        try {
            const contacts = await contactService_1.contactService.getContactsByEvangelist(req.params.evangelistName);
            res.json(contacts);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async searchContacts(req, res) {
        try {
            const contacts = await contactService_1.contactService.searchContacts(req.body.query);
            res.json(contacts);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    async filterContacts(req, res) {
        try {
            const contacts = await contactService_1.contactService.filterContacts(req.body);
            res.json(contacts);
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
                return;
            }
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}
exports.ContactController = ContactController;
exports.contactController = new ContactController();
