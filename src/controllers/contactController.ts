import { Request, Response, RequestHandler } from 'express';
import { contactService } from '../services/contactService';
import { 
  CreateContactDTO,
  UpdateContactDTO,
  CreateContactInput,
  UpdateContactInput
} from '../types/contact';
import { IContactService } from '../types/services';

export class ContactController {
  private contactService: IContactService;

  constructor(contactService: IContactService) {
    this.contactService = contactService;
  }

  async createContact(req: Request<{}, {}, CreateContactDTO>, res: Response): Promise<void> {
    try {
      const { first_visit_date, ...rest } = req.body;
      const contact = await this.contactService.createContact({
        ...rest,
        first_visit_date: new Date(first_visit_date)
      });
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getContactById(req: Request<{ id: string }, {}, {}, {}>, res: Response): Promise<void> {
    try {
      const contact = await this.contactService.getContactById(req.params.id);
      if (!contact) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      res.json(contact);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getAllContacts(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await this.contactService.getAllContacts();
      res.json(contacts);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async updateContact(req: Request<{ id: string }, {}, UpdateContactDTO>, res: Response): Promise<void> {
    try {
      const { first_visit_date, ...rest } = req.body;
      const updateData: UpdateContactInput = {
        ...rest,
        ...(first_visit_date && { first_visit_date: new Date(first_visit_date) })
      };
      const contact = await this.contactService.updateContact(req.params.id, updateData);
      if (!contact) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      res.json(contact);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async deleteContact(req: Request<{ id: string }, {}, {}, {}>, res: Response): Promise<void> {
    try {
      const contact = await this.contactService.deleteContact(req.params.id);
      if (!contact) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getFirstTimers(req: Request, res: Response): Promise<void> {
    try {
      const contacts = await this.contactService.getFirstTimers();
      res.json(contacts);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async getContactsByEvangelist(req: Request<{ evangelistName: string }, {}, {}, {}>, res: Response): Promise<void> {
    try {
      const contacts = await this.contactService.getContactsByEvangelist(req.params.evangelistName);
      res.json(contacts);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}

export const contactController = new ContactController(contactService);
