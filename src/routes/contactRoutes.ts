/**
 * @fileoverview API routes for managing church contacts
 * @module routes/contactRoutes
 */

import { Router } from 'express';
import { contactController } from '../controllers/contactController';

const router = Router();

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *               - phone
 *               - evangelist_name
 *               - first_visit_date
 *             properties:
 *               name:
 *                 type: string
 *                 description: Contact's full name
 *               gender:
 *                 type: string
 *                 enum: ['male', 'female']
 *                 description: Contact's gender
 *               phone:
 *                 type: string
 *                 description: Contact's phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact's email address (optional)
 *               evangelist_name:
 *                 type: string
 *                 description: Name of the evangelist
 *               first_visit_date:
 *                 type: string
 *                 format: date
 *                 description: Date of first visit
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Contact ID
 *                 name:
 *                   type: string
 *                   description: Contact's full name
 *                 gender:
 *                   type: string
 *                   enum: ['male', 'female']
 *                   description: Contact's gender
 *                 phone:
 *                   type: string
 *                   description: Contact's phone number
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Contact's email address
 *                 evangelist_name:
 *                   type: string
 *                   description: Name of the evangelist
 *                 first_visit_date:
 *                   type: string
 *                   format: date
 *                   description: Date of first visit
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when contact was created
 *       400:
 *         description: Bad request (invalid data)
 *       500:
 *         description: Internal server error
 */
router.post('/', contactController.createContact);

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contact ID
 *                   name:
 *                     type: string
 *                     description: Contact's full name
 *                   gender:
 *                     type: string
 *                     enum: ['male', 'female']
 *                     description: Contact's gender
 *                   phone:
 *                     type: string
 *                     description: Contact's phone number
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Contact's email address
 *                   evangelist_name:
 *                     type: string
 *                     description: Name of the evangelist
 *                   first_visit_date:
 *                     type: string
 *                     format: date
 *                     description: Date of first visit
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when contact was created
 *       500:
 *         description: Internal server error
 */
router.get('/', contactController.getAllContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a specific contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contact
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Contact ID
 *                 name:
 *                   type: string
 *                   description: Contact's full name
 *                 gender:
 *                   type: string
 *                   enum: ['male', 'female']
 *                   description: Contact's gender
 *                 phone:
 *                   type: string
 *                   description: Contact's phone number
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Contact's email address
 *                 evangelist_name:
 *                   type: string
 *                   description: Name of the evangelist
 *                 first_visit_date:
 *                   type: string
 *                   format: date
 *                   description: Date of first visit
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when contact was created
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', contactController.getContactById);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Contact's full name
 *               gender:
 *                 type: string
 *                 enum: ['male', 'female']
 *                 description: Contact's gender
 *               phone:
 *                 type: string
 *                 description: Contact's phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact's email address
 *               evangelist_name:
 *                 type: string
 *                 description: Name of the evangelist
 *               first_visit_date:
 *                 type: string
 *                 format: date
 *                 description: Date of first visit
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Contact ID
 *                 name:
 *                   type: string
 *                   description: Contact's full name
 *                 gender:
 *                   type: string
 *                   enum: ['male', 'female']
 *                   description: Contact's gender
 *                 phone:
 *                   type: string
 *                   description: Contact's phone number
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Contact's email address
 *                 evangelist_name:
 *                   type: string
 *                   description: Name of the evangelist
 *                 first_visit_date:
 *                   type: string
 *                   format: date
 *                   description: Date of first visit
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp when contact was created
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', contactController.updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contact to delete
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       404:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', contactController.deleteContact);

/**
 * @swagger
 * /contacts/first-timers:
 *   get:
 *     summary: Get first-time visitors from the last month
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: First-time visitors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contact ID
 *                   name:
 *                     type: string
 *                     description: Contact's full name
 *                   gender:
 *                     type: string
 *                     enum: ['male', 'female']
 *                     description: Contact's gender
 *                   phone:
 *                     type: string
 *                     description: Contact's phone number
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Contact's email address
 *                   evangelist_name:
 *                     type: string
 *                     description: Name of the evangelist
 *                   first_visit_date:
 *                     type: string
 *                     format: date
 *                     description: Date of first visit
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when contact was created
 *       500:
 *         description: Internal server error
 */
router.get('/first-timers', contactController.getFirstTimers);

/**
 * @swagger
 * /contacts/by-evangelist/{evangelistName}:
 *   get:
 *     summary: Get contacts by evangelist
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: evangelistName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the evangelist
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contact ID
 *                   name:
 *                     type: string
 *                     description: Contact's full name
 *                   gender:
 *                     type: string
 *                     enum: ['male', 'female']
 *                     description: Contact's gender
 *                   phone:
 *                     type: string
 *                     description: Contact's phone number
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Contact's email address
 *                   evangelist_name:
 *                     type: string
 *                     description: Name of the evangelist
 *                   first_visit_date:
 *                     type: string
 *                     format: date
 *                     description: Date of first visit
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when contact was created
 *       500:
 *         description: Internal server error
 */
router.get('/by-evangelist/:evangelistName', contactController.getContactsByEvangelist);

/**
 * @swagger
 * /contacts/search:
 *   post:
 *     summary: Search contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Search term to look for in name, email, phone, or evangelist name
 *     responses:
 *       200:
 *         description: Matching contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contact ID
 *                   name:
 *                     type: string
 *                     description: Contact's full name
 *                   gender:
 *                     type: string
 *                     enum: ['male', 'female']
 *                     description: Contact's gender
 *                   phone:
 *                     type: string
 *                     description: Contact's phone number
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Contact's email address
 *                   evangelist_name:
 *                     type: string
 *                     description: Name of the evangelist
 *                   first_visit_date:
 *                     type: string
 *                     format: date
 *                     description: Date of first visit
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when contact was created
 *       500:
 *         description: Internal server error
 */
router.post('/search', contactController.searchContacts);

/**
 * @swagger
 * /contacts/filter:
 *   post:
 *     summary: Filter contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *                 enum: ['male', 'female']
 *                 description: Filter by gender
 *               evangelist:
 *                 type: string
 *                 description: Filter by evangelist name
 *               dateRange:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date
 *                     description: Start date for first visit
 *                   end:
 *                     type: string
 *                     format: date
 *                     description: End date for first visit
 *     responses:
 *       200:
 *         description: Filtered contacts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Contact ID
 *                   name:
 *                     type: string
 *                     description: Contact's full name
 *                   gender:
 *                     type: string
 *                     enum: ['male', 'female']
 *                     description: Contact's gender
 *                   phone:
 *                     type: string
 *                     description: Contact's phone number
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Contact's email address
 *                   evangelist_name:
 *                     type: string
 *                     description: Name of the evangelist
 *                   first_visit_date:
 *                     type: string
 *                     format: date
 *                     description: Date of first visit
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when contact was created
 *       500:
 *         description: Internal server error
 */
router.post('/filter', contactController.filterContacts);

export default router;
