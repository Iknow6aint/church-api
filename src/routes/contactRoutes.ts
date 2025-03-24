import { Router } from 'express';
import { contactController } from '../controllers/contactController';

const router = Router();

// CRUD operations for contacts
router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

// Additional routes
router.get('/first-timers', contactController.getFirstTimers);
router.get('/by-evangelist/:evangelistName', contactController.getContactsByEvangelist);

export default router;
